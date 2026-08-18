import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { d1Query } from "@/lib/d1";
import { validateNoticePopupInput } from "@/lib/notice-popup-validation";
import { deleteFromStorage, storagePathFromPublicUrl } from "@/lib/supabase";
import type { NoticePopup } from "@/types/notice-popup";

type RouteParams = { params: Promise<{ id: string }> };

async function deleteImageFile(imageUrl: string) {
  const path = storagePathFromPublicUrl(imageUrl);
  if (!path) return;
  try {
    await deleteFromStorage(path);
  } catch (error) {
    console.error("팝업 이미지 스토리지 삭제 실패:", error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const popupId = Number(id);
  if (!Number.isInteger(popupId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl : "";
  const targetUrl = typeof body?.targetUrl === "string" ? body.targetUrl.trim() : "";
  const hideDurationDays = Number(body?.hideDurationDays);
  const startDate = typeof body?.startDate === "string" ? body.startDate : "";
  const endDate = typeof body?.endDate === "string" ? body.endDate : "";
  const isHidden = Boolean(body?.isHidden);
  const size = typeof body?.size === "string" ? body.size : "medium";

  const validationError = validateNoticePopupInput({
    imageUrl,
    targetUrl,
    hideDurationDays,
    startDate,
    endDate,
    size,
  });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const existing = await d1Query<Pick<NoticePopup, "image_url">>(
      "SELECT image_url FROM notice_popups WHERE id = ?",
      [popupId],
      { noStore: true },
    );
    if (!existing[0]) {
      return NextResponse.json(
        { error: "존재하지 않는 팝업입니다." },
        { status: 404 },
      );
    }

    if (existing[0].image_url && existing[0].image_url !== imageUrl) {
      await deleteImageFile(existing[0].image_url);
    }

    await d1Query(
      `UPDATE notice_popups
       SET image_url = ?, target_url = ?, hide_duration_days = ?, start_date = ?,
           end_date = ?, is_hidden = ?, size = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        imageUrl,
        targetUrl || null,
        hideDurationDays,
        startDate,
        endDate,
        isHidden ? 1 : 0,
        size,
        popupId,
      ],
      { noStore: true },
    );
  } catch (error) {
    console.error("공지 팝업 수정 실패:", error);
    return NextResponse.json(
      { error: "공지 팝업 수정에 실패했습니다." },
      { status: 500 },
    );
  }

  revalidatePath("/admin/notice-popups");

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const popupId = Number(id);
  if (!Number.isInteger(popupId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    const existing = await d1Query<Pick<NoticePopup, "image_url">>(
      "SELECT image_url FROM notice_popups WHERE id = ?",
      [popupId],
      { noStore: true },
    );

    if (existing[0]?.image_url) {
      await deleteImageFile(existing[0].image_url);
    }

    await d1Query("DELETE FROM notice_popups WHERE id = ?", [popupId], {
      noStore: true,
    });
  } catch (error) {
    console.error("공지 팝업 삭제 실패:", error);
    return NextResponse.json(
      { error: "공지 팝업 삭제에 실패했습니다." },
      { status: 500 },
    );
  }

  revalidatePath("/admin/notice-popups");

  return NextResponse.json({ success: true });
}
