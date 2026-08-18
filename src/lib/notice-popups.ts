import { d1Query } from "@/lib/d1";
import type { NoticePopup } from "@/types/notice-popup";

const SELECT_COLUMNS =
  "id, image_url, target_url, hide_duration_days, start_date, end_date, priority, is_hidden, size, created_at, updated_at";

/** 어드민 목록 조회. D1 장애 시에도 페이지가 죽지 않도록 빈 배열로 폴백한다. */
export async function getNoticePopups(): Promise<NoticePopup[]> {
  try {
    return await d1Query<NoticePopup>(
      `SELECT ${SELECT_COLUMNS} FROM notice_popups ORDER BY priority DESC, created_at ASC`,
    );
  } catch (error) {
    console.error("공지 팝업 조회 실패:", error);
    return [];
  }
}

/**
 * 공개 노출용 — 숨김 처리되지 않았고 오늘이 게시 기간 안에 있는 팝업만 서버에서 필터링한다.
 * date('now')는 UTC 기준이라 자정~오전 9시(KST) 사이엔 하루 전날로 계산돼 게시 시작일이
 * 하루 늦게 풀리는 문제가 있었다 — 한국은 DST가 없으므로 +9시간 고정 오프셋으로 보정한다.
 */
export async function getActiveNoticePopups(): Promise<NoticePopup[]> {
  try {
    return await d1Query<NoticePopup>(
      `SELECT ${SELECT_COLUMNS} FROM notice_popups
       WHERE is_hidden = 0 AND date('now', '+9 hours') BETWEEN start_date AND end_date
       ORDER BY priority DESC, created_at ASC`,
    );
  } catch (error) {
    console.error("활성 공지 팝업 조회 실패:", error);
    return [];
  }
}

