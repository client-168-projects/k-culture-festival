import { d1Query } from "@/lib/d1";
import type { Notice, NoticeAttachment } from "@/types/notice";

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
 */
export async function getNoticeById(id: number): Promise<Notice | null> {
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
}
