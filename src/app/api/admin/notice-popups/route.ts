import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { d1Query } from "@/lib/d1";
import { getNoticePopups } from "@/lib/notice-popups";
import { validateNoticePopupInput } from "@/lib/notice-popup-validation";
import { isStorageUrl } from "@/lib/supabase";

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const popups = await getNoticePopups();
  return NextResponse.json({ popups });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

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
  if (!isStorageUrl(imageUrl, "images")) {
    return NextResponse.json({ error: "잘못된 이미지 주소입니다." }, { status: 400 });
  }

  try {
    const existing = await d1Query<{ max_priority: number | null }>(
      "SELECT MAX(priority) as max_priority FROM notice_popups",
    );
    const nextPriority = (existing[0]?.max_priority ?? 90) + 10;

    const rows = await d1Query<{ id: number }>(
      `INSERT INTO notice_popups
         (image_url, target_url, hide_duration_days, start_date, end_date, priority, is_hidden, size)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id`,
      [
        imageUrl,
        targetUrl || null,
        hideDurationDays,
        startDate,
        endDate,
        nextPriority,
        isHidden ? 1 : 0,
        size,
      ],
      { noStore: true },
    );

    revalidatePath("/admin/notice-popups");

    return NextResponse.json({ id: rows[0]?.id }, { status: 201 });
  } catch (error) {
    console.error("공지 팝업 생성 실패:", error);
    return NextResponse.json(
      { error: "공지 팝업 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
