import type { PopupSize } from "@/types/notice-popup";

export const HIDE_DURATION_OPTIONS = [1, 3, 7, 14, 30] as const;

// 팝업 너비. 높이는 이미지 비율을 따른다.
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

// 업로드 이미지 긴 변 최대 길이(px)
export const POPUP_IMAGE_MAX_DIMENSION = 1600;

// 홈 히어로 인트로(약 3.7초)가 끝난 뒤 팝업을 띄우기 위한 지연
export const POPUP_LANDING_DELAY_MS = 3800;
