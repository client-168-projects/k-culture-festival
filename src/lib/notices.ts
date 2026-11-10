import { cache } from "react";

import { MAX_ATTACHMENTS_PER_NOTICE } from "@/constants/media";
import { d1Query } from "@/lib/d1";
import type { Notice, NoticeAttachment } from "@/types/notice";

export type AttachmentInput = { file_name: string; file_url: string; file_size: number };

/** 요청 본문의 attachments 배열을 검증/정제한다. */
export function parseAttachments(body: unknown): AttachmentInput[] {
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

/** 공지사항 목록 조회. D1 오류 시 빌드/렌더링이 실패하지 않도록 빈 배열을 반환한다. */
export async function getNotices(): Promise<Notice[]> {
  try {
    const [notices, attachments] = await Promise.all([
      d1Query<Omit<Notice, "attachments">>(
        "SELECT id, title, content, is_pinned, created_at, updated_at FROM notices ORDER BY is_pinned DESC, created_at DESC",
      ),
      d1Query<NoticeAttachment>(
        "SELECT id, notice_id, file_name, file_url, file_size, created_at FROM notice_attachments ORDER BY created_at ASC",
      ),
    ]);

    return notices.map((notice) => ({
      ...notice,
      attachments: attachments.filter((a) => a.notice_id === notice.id),
    }));
  } catch (error) {
    console.error("공지사항 조회 실패:", error);
    return [];
  }
}

/**
 * 공지사항 상세 조회. 없거나 조회 실패 시 null.
 * d1Query는 POST라 fetch 메모이제이션이 적용되지 않으므로 cache()로 요청 내 중복 호출을 막는다.
 */
export const getNoticeById = cache(async (id: number): Promise<Notice | null> => {
  try {
    const [notices, attachments] = await Promise.all([
      d1Query<Omit<Notice, "attachments">>(
        "SELECT id, title, content, is_pinned, created_at, updated_at FROM notices WHERE id = ?",
        [id],
      ),
      d1Query<NoticeAttachment>(
        "SELECT id, notice_id, file_name, file_url, file_size, created_at FROM notice_attachments WHERE notice_id = ? ORDER BY created_at ASC",
        [id],
      ),
    ]);

    const notice = notices[0];
    if (!notice) return null;

    return { ...notice, attachments };
  } catch (error) {
    console.error("공지사항 상세 조회 실패:", error);
    return null;
  }
});
