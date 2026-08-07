import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { d1Query } from "@/lib/d1";
import { sanitizeNoticeContent } from "@/lib/sanitize";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content : "";

  if (!title || !content) {
    return NextResponse.json(
      { error: "제목과 내용을 모두 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    await d1Query(
      `UPDATE notices
       SET title = ?, content = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [title, sanitizeNoticeContent(content), noticeId],
      { noStore: true },
    );
  } catch (error) {
    console.error("공지사항 수정 실패:", error);
    return NextResponse.json(
      { error: "공지사항 수정에 실패했습니다." },
      { status: 500 },
    );
  }

  revalidatePath("/community/notice");
  revalidatePath("/admin/notices");

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    await d1Query("DELETE FROM notices WHERE id = ?", [noticeId], {
      noStore: true,
    });
  } catch (error) {
    console.error("공지사항 삭제 실패:", error);
    return NextResponse.json(
      { error: "공지사항 삭제에 실패했습니다." },
      { status: 500 },
    );
  }

  revalidatePath("/community/notice");
  revalidatePath("/admin/notices");

  return NextResponse.json({ success: true });
}
