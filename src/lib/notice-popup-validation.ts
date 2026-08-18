import type { NoticePopup, PopupSize, PopupStatus } from "@/types/notice-popup";

const POPUP_SIZES: PopupSize[] = ["small", "medium", "large"];

/**
 * D1 접근 코드(src/lib/notice-popups.ts)와 분리된 순수 함수 모듈.
 * 어드민 클라이언트 컴포넌트(다이얼로그/매니저)에서도 import하므로 서버 전용 의존성을
 * 여기 섞으면 안 된다.
 */

/**
 * 한국(KST, UTC+9 고정 — DST 없음) 기준 오늘 날짜를 "YYYY-MM-DD"로 반환한다.
 * `new Date().toISOString()`은 UTC 날짜라서 자정~오전 9시(KST) 사이에는 하루 전날로
 * 계산돼 "게시 예정"이 하루 늦게 풀리는 문제가 있었다 — 항상 이 함수를 사용한다.
 */
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

/** 생성/수정 폼 입력을 검증한다. 클라이언트(다이얼로그)와 서버(API 라우트) 양쪽에서 공유. */
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
