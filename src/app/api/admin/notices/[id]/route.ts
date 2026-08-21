import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { d1Query } from "@/lib/d1";
import { parseAttachments } from "@/lib/notices";
import { sanitizeNoticeContent } from "@/lib/sanitize";
import { deleteFromStorage, storagePathFromPublicUrl } from "@/lib/supabase";
import type { NoticeAttachment } from "@/types/notice";

type RouteParams = { params: Promise<{ id: string }> };

async function deleteAttachmentFiles(attachments: { file_url: string }[]) {
  await Promise.all(
    attachments.map(async (attachment) => {
      const path = storagePathFromPublicUrl(attachment.file_url);
      if (!path) return;
      try {
        await deleteFromStorage(path);
      } catch (error) {
        console.error("첨부파일 스토리지 삭제 실패:", error);
      }
    }),
  );
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

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
    const updated = await d1Query<{ id: number }>(
      `UPDATE notices
       SET title = ?, content = ?, is_pinned = ?, updated_at = datetime('now')
       WHERE id = ?
       RETURNING id`,
      [title, sanitizeNoticeContent(content), isPinned, noticeId],
      { noStore: true },
    );

    if (!updated[0]) {
      return NextResponse.json(
        { error: "존재하지 않는 공지사항입니다." },
        { status: 404 },
      );
    }

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
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

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
