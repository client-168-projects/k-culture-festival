import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// 스킴이 빠진 주소(www.example.com)를 절대 URL로 보정
export function toAbsoluteUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// ISO 시각을 "2026. 8. 31.(월) AM 10:00" 형식(KST)으로 변환
export function formatKstOpensAt(iso: string): string {
  const date = new Date(iso);

  const dateParts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date);
  const getDatePart = (type: Intl.DateTimeFormatPartTypes) =>
    dateParts.find((part) => part.type === type)?.value ?? "";

  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const getTimePart = (type: Intl.DateTimeFormatPartTypes) =>
    timeParts.find((part) => part.type === type)?.value ?? "";

  return `${getDatePart("year")}. ${getDatePart("month")}. ${getDatePart("day")}.(${getDatePart("weekday")}) ${getTimePart("dayPeriod")} ${getTimePart("hour")}:${getTimePart("minute")}`;
}
