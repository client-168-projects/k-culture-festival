import { cache } from "react";

import { MAX_ATTACHMENTS_PER_NOTICE } from "@/constants/media";
import { d1Query } from "@/lib/d1";
import { isStorageUrl } from "@/lib/supabase";
import type { Notice, NoticeAttachment } from "@/types/notice";

export type AttachmentInput = { file_name: string; file_url: string; file_size: number };

// 공지 생성, 수정에서 받는 첨부파일 목록 검증
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
    // 첨부 링크는 자체 Storage에 올린 파일만 허용 (javascript: 같은 주소가 공개 페이지에 들어가지 않게)
    .filter(
      (a) =>
        isStorageUrl(a.file_url, "attachments") &&
        a.file_name.length > 0 &&
        a.file_name.length <= 200 &&
        Number.isFinite(a.file_size) &&
        a.file_size >= 0,
    )
    .slice(0, MAX_ATTACHMENTS_PER_NOTICE);
}

// D1 조회가 실패해도 페이지가 깨지지 않도록 빈 배열을 반환한다.
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

// d1Query는 POST라 fetch 중복 제거가 안 돼서 cache()로 감싼다. (generateMetadata와 페이지에서 중복 호출)
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
