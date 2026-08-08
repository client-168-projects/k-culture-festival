import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { MAX_ATTACHMENTS_PER_NOTICE } from "@/constants/media";
import { getAdminSession } from "@/lib/auth";
import { d1Query } from "@/lib/d1";
import { sanitizeNoticeContent } from "@/lib/sanitize";
import { deleteFromStorage, storagePathFromPublicUrl } from "@/lib/supabase";
import type { NoticeAttachment } from "@/types/notice";

type RouteParams = { params: Promise<{ id: string }> };
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

async function deleteAttachmentFiles(attachments: { file_url: string }[]) {
  for (const attachment of attachments) {
    const path = storagePathFromPublicUrl(attachment.file_url);
    if (!path) continue;
    try {
      await deleteFromStorage(path);
    } catch (error) {
      console.error("첨부파일 스토리지 삭제 실패:", error);
    }
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

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
    await d1Query(
      `UPDATE notices
       SET title = ?, content = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [title, sanitizeNoticeContent(content), noticeId],
      { noStore: true },
    );

    const existing = await d1Query<NoticeAttachment>(
      "SELECT id, notice_id, file_name, file_url, file_size, created_at FROM notice_attachments WHERE notice_id = ?",
      [noticeId],
      { noStore: true },
    );

    const keptUrls = new Set(attachments.map((a) => a.file_url));
    const removed = existing.filter((a) => !keptUrls.has(a.file_url));
    await deleteAttachmentFiles(removed);

    await d1Query("DELETE FROM notice_attachments WHERE notice_id = ?", [noticeId], {
      noStore: true,
    });
    for (const attachment of attachments) {
      await d1Query(
        `INSERT INTO notice_attachments (notice_id, file_name, file_url, file_size)
         VALUES (?, ?, ?, ?)`,
        [noticeId, attachment.file_name, attachment.file_url, attachment.file_size],
        { noStore: true },
      );
    }
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
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    const existing = await d1Query<NoticeAttachment>(
      "SELECT id, notice_id, file_name, file_url, file_size, created_at FROM notice_attachments WHERE notice_id = ?",
      [noticeId],
      { noStore: true },
    );
    await deleteAttachmentFiles(existing);

    await d1Query("DELETE FROM notice_attachments WHERE notice_id = ?", [noticeId], {
      noStore: true,
    });
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
