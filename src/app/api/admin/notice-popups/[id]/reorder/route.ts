import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { d1Query } from "@/lib/d1";
import { getNoticePopups } from "@/lib/notice-popups";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const popupId = Number(id);
  if (!Number.isInteger(popupId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const direction = body?.direction;
  if (direction !== "up" && direction !== "down") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    const popups = await getNoticePopups();
    const index = popups.findIndex((p) => p.id === popupId);
    if (index === -1) {
      return NextResponse.json(
        { error: "존재하지 않는 팝업입니다." },
        { status: 404 },
      );
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= popups.length) {
      return NextResponse.json({ success: true });
    }

    const current = popups[index];
    const target = popups[swapIndex];

    await Promise.all([
      d1Query(
        "UPDATE notice_popups SET priority = ?, updated_at = datetime('now') WHERE id = ?",
        [target.priority, current.id],
        { noStore: true },
      ),
      d1Query(
        "UPDATE notice_popups SET priority = ?, updated_at = datetime('now') WHERE id = ?",
        [current.priority, target.id],
        { noStore: true },
      ),
    ]);
  } catch (error) {
    console.error("공지 팝업 순서 변경 실패:", error);
    return NextResponse.json(
      { error: "순서 변경에 실패했습니다." },
      { status: 500 },
    );
  }

  revalidatePath("/admin/notice-popups");

  return NextResponse.json({ success: true });
}
