const STORAGE_KEY = "kcf-notice-popup-hidden";

type HiddenMap = Record<string, string>;

function readMap(): HiddenMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMap(map: HiddenMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage 접근 불가(프라이빗 모드 등) — 조용히 무시, 팝업은 매번 다시 노출된다.
  }
}

export function isPopupHidden(id: number): boolean {
  const until = readMap()[`popup-${id}`];
  if (!until) return false;
  return new Date(until).getTime() > Date.now();
}

/** 팝업 ID별로 독립적으로 "N일간 보지 않기"를 기록한다. */
export function hidePopupForDays(id: number, days: number) {
  const map = readMap();
  map[`popup-${id}`] = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  writeMap(map);
}
