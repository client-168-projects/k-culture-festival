import type { NoticePopup, PopupSize, PopupStatus } from "@/types/notice-popup";

const POPUP_SIZES: PopupSize[] = ["small", "medium", "large"];

// 관리자 클라이언트 컴포넌트에서도 import하므로 서버 전용 코드를 넣지 않는다.

// KST 기준 오늘 날짜(YYYY-MM-DD). toISOString()은 UTC라 자정~오전 9시에 하루가 밀린다.
export function todayInKst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function getPopupStatus(
  popup: Pick<NoticePopup, "start_date" | "end_date" | "is_hidden">,
  today: string = todayInKst(),
): PopupStatus {
  if (popup.is_hidden) return "hidden";
  if (today < popup.start_date) return "scheduled";
  if (today > popup.end_date) return "ended";
  return "active";
}

// 클라이언트와 서버에서 같이 쓰는 팝업 입력 검증
export function validateNoticePopupInput(input: {
  imageUrl: string;
  targetUrl: string;
  hideDurationDays: number;
  startDate: string;
  endDate: string;
  size: string;
}): string | null {
  if (!input.imageUrl) {
    return "이미지를 업로드해주세요.";
  }
  if (!input.startDate || !input.endDate) {
    return "게시 기간을 선택해주세요.";
  }
  if (input.startDate > input.endDate) {
    return "시작일은 종료일보다 이후일 수 없습니다.";
  }
  if (!Number.isInteger(input.hideDurationDays) || input.hideDurationDays <= 0) {
    return "다시 보지 않기 기간을 선택해주세요.";
  }
  if (!POPUP_SIZES.includes(input.size as PopupSize)) {
    return "팝업 크기를 선택해주세요.";
  }
  if (input.targetUrl) {
    try {
      const url = new URL(input.targetUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return "이동 URL은 http(s) 주소여야 합니다.";
      }
    } catch {
      return "이동 URL 형식이 올바르지 않습니다.";
    }
  }
  return null;
}
