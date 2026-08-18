"use client";

import { useEffect, useState } from "react";

import { POPUP_LANDING_DELAY_MS } from "@/constants/notice-popup";
import { NoticePopupCard } from "@/features/notice-popup/components/notice-popup-card";
import { hidePopupForDays, isPopupHidden } from "@/features/notice-popup/lib/popup-dismissal";
import { cn } from "@/lib/utils";
import type { NoticePopup } from "@/types/notice-popup";

export function NoticePopupManager() {
  const [queue, setQueue] = useState<NoticePopup[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/popups/active");
        const body = await res.json().catch(() => null);
        const popups: NoticePopup[] = Array.isArray(body?.popups) ? body.popups : [];
        if (!cancelled) {
          setQueue(popups.filter((popup) => !isPopupHidden(popup.id)));
        }
      } catch {
        if (!cancelled) setQueue([]);
      }
    }, POPUP_LANDING_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  function handleClose(id: number, hideDays: number | null) {
    if (hideDays !== null) {
      hidePopupForDays(id, hideDays);
    }
    setQueue((prev) => (prev ? prev.filter((popup) => popup.id !== id) : prev));
  }

  if (!queue || queue.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-50 flex flex-col-reverse items-stretch gap-3",
        "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:flex-row-reverse sm:items-end sm:justify-start",
        "lg:right-8 lg:bottom-8",
      )}
    >
      {queue.map((popup) => (
        <NoticePopupCard
          key={popup.id}
          popup={popup}
          onClose={(hideDays) => handleClose(popup.id, hideDays)}
        />
      ))}
    </div>
  );
}
