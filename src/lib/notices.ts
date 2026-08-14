import { cache } from "react";

import { MAX_ATTACHMENTS_PER_NOTICE } from "@/constants/media";
import { d1Query } from "@/lib/d1";
import type { Notice, NoticeAttachment } from "@/types/notice";

export type AttachmentInput = { file_name: string; file_url: string; file_size: number };

/** 요청 본문의 attachments 배열을 검증/정제한다. 공지 생성(POST)·수정(PUT) 양쪽에서 공유. */
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

/**
 * 공지사항 목록 조회. D1 환경변수가 없거나 API 호출이 실패해도 페이지 빌드/렌더링이
 * 죽지 않도록 빈 배열로 안전하게 폴백한다 (배포 환경변수 미설정, 일시적 D1 장애 등).
 */
export async function getNotices(): Promise<Notice[]> {
  try {
    const [notices, attachments] = await Promise.all([
      d1Query<Omit<Notice, "attachments">>(
        "SELECT id, title, content, created_at, updated_at FROM notices ORDER BY created_at DESC",
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
 * 공지사항 상세 조회. 존재하지 않거나 D1 조회에 실패하면 null을 반환한다 (호출부에서 notFound() 처리).
 * `d1Query`가 POST 요청이라 Next의 fetch 요청 메모이제이션(GET 전용)이 적용되지 않으므로,
 * generateMetadata와 페이지 컴포넌트가 같은 요청 안에서 중복 호출하지 않도록 React cache()로 감싼다.
 */
export const getNoticeById = cache(async (id: number): Promise<Notice | null> => {
  try {
    const [notices, attachments] = await Promise.all([
      d1Query<Omit<Notice, "attachments">>(
        "SELECT id, title, content, created_at, updated_at FROM notices WHERE id = ?",
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
