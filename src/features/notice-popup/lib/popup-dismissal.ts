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
    // localStorage를 못 쓰면(시크릿 모드 등) 무시
  }
}

export function isPopupHidden(id: number): boolean {
  const until = readMap()[`popup-${id}`];
  if (!until) return false;
  return new Date(until).getTime() > Date.now();
}

export function hidePopupForDays(id: number, days: number) {
  const map = readMap();
  map[`popup-${id}`] = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  writeMap(map);
}
