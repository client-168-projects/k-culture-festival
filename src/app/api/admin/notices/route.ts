import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { d1Query } from "@/lib/d1";
import { parseAttachments } from "@/lib/notices";
import { sanitizeNoticeContent } from "@/lib/sanitize";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content : "";
  const isPinned = body?.is_pinned === true ? 1 : 0;
  const attachments = parseAttachments(body);

  if (!title || !content) {
    return NextResponse.json(
      { error: "제목과 내용을 모두 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    const rows = await d1Query<{ id: number }>(
      `INSERT INTO notices (title, content, is_pinned)
       VALUES (?, ?, ?)
       RETURNING id`,
      [title, sanitizeNoticeContent(content), isPinned],
      { noStore: true },
    );
    const noticeId = rows[0]?.id;

    await Promise.all(
      attachments.map((attachment) =>
        d1Query(
          `INSERT INTO notice_attachments (notice_id, file_name, file_url, file_size)
           VALUES (?, ?, ?, ?)`,
          [noticeId, attachment.file_name, attachment.file_url, attachment.file_size],
          { noStore: true },
        ),
      ),
    );

    revalidatePath("/community/notice");
    revalidatePath("/admin/notices");

    return NextResponse.json({ id: noticeId }, { status: 201 });
  } catch (error) {
    console.error("공지사항 생성 실패:", error);
    return NextResponse.json(
      { error: "공지사항 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
