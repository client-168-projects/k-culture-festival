"use client";

import { useSyncExternalStore } from "react";

let hidden = false;
const listeners = new Set<() => void>();

/** 스크롤로 상단 네브바가 숨겨졌는지 여부를 설정. 네브바 자신만 호출한다. */
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

/** 네브바와 무관한 컴포넌트(예: 고정 티커)가 네브바 숨김 여부에 맞춰 위치를 조정할 때 사용 */
export function useNavHidden() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
