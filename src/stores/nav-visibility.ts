"use client";

import { useSyncExternalStore } from "react";

let hidden = false;
const listeners = new Set<() => void>();

/** 상단 네브바 숨김 여부 설정 (네브바에서만 호출) */
export function setNavHidden(value: boolean) {
  if (hidden === value) return;
  hidden = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return hidden;
}

function getServerSnapshot() {
  return false;
}

/** 네브바 숨김 여부 구독 */
export function useNavHidden() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
