import { d1Query } from "@/lib/d1";
import type { NoticePopup } from "@/types/notice-popup";

const SELECT_COLUMNS =
  "id, image_url, target_url, hide_duration_days, start_date, end_date, priority, is_hidden, size, created_at, updated_at";

// D1 조회가 실패하면 빈 배열 반환
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

// 숨김이 아니고 오늘(KST)이 게시 기간인 팝업만 조회한다. date('now')는 UTC라 +9시간 보정.
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

