"use client";

import { useSyncExternalStore } from "react";

let hidden = false;
const listeners = new Set<() => void>();

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

// 네비 숨김 여부에 맞춰 위치를 바꿔야 하는 컴포넌트용
export function useNavHidden() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
