import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { MAX_ATTACHMENTS_PER_NOTICE } from "@/constants/media";
import { d1Query } from "@/lib/d1";
import { sanitizeNoticeContent } from "@/lib/sanitize";

type AttachmentInput = { file_name: string; file_url: string; file_size: number };

function parseAttachments(body: unknown): AttachmentInput[] {
  const raw = (body as { attachments?: unknown })?.attachments;
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (a): a is AttachmentInput =>
        typeof a === "object" &&
        a !== null &&
        typeof (a as AttachmentInput).file_name === "string" &&
        typeof (a as AttachmentInput).file_url === "string" &&
        typeof (a as AttachmentInput).file_size === "number",
    )
    .slice(0, MAX_ATTACHMENTS_PER_NOTICE);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content : "";
  const attachments = parseAttachments(body);

  if (!title || !content) {
    return NextResponse.json(
      { error: "제목과 내용을 모두 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    const rows = await d1Query<{ id: number }>(
      `INSERT INTO notices (title, content)
       VALUES (?, ?)
       RETURNING id`,
      [title, sanitizeNoticeContent(content)],
      { noStore: true },
    );
    const noticeId = rows[0]?.id;

    for (const attachment of attachments) {
      await d1Query(
        `INSERT INTO notice_attachments (notice_id, file_name, file_url, file_size)
         VALUES (?, ?, ?, ?)`,
        [noticeId, attachment.file_name, attachment.file_url, attachment.file_size],
        { noStore: true },
      );
    }

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
