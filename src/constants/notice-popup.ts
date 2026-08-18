import type { PopupSize } from "@/types/notice-popup";

export const HIDE_DURATION_OPTIONS = [1, 3, 7, 14, 30] as const;

/** 팝업 너비 프리셋 — 높이는 이미지 원본 비율에 따라 자동으로 정해진다(크롭/여백 없음). */
export const POPUP_SIZE_OPTIONS: { value: PopupSize; label: string; widthPx: number }[] = [
  { value: "small", label: "작게", widthPx: 280 },
  { value: "medium", label: "보통", widthPx: 340 },
  { value: "large", label: "크게", widthPx: 400 },
];

export const POPUP_SIZE_WIDTH_CLASS: Record<PopupSize, string> = {
  small: "sm:w-70",
  medium: "sm:w-85",
  large: "sm:w-100",
};

/** 업로드 이미지의 긴 변 최대 길이(px). 초과 시 클라이언트에서 리사이징 후 업로드한다. */
export const POPUP_IMAGE_MAX_DIMENSION = 1600;

/**
 * 홈 히어로 인트로(배경 슬라이드 + 텍스트 reveal + lg 이상에서 KMarkGraphic 조립)가
 * 실제로 끝나는 시점(약 3.7초, hero-section.tsx 기준)까지 팝업 노출을 미루기 위한
 * 지연 시간. Hero는 완료 콜백/이벤트를 상위로 노출하지 않아 setTimeout 폴백을 쓴다.
 */
export const POPUP_LANDING_DELAY_MS = 3800;
