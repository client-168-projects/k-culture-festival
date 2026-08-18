"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { POPUP_SIZE_WIDTH_CLASS } from "@/constants/notice-popup";
import { cn } from "@/lib/utils";
import type { NoticePopup } from "@/types/notice-popup";

const ANIMATION_MS = 200;

type Props = {
  popup: NoticePopup;
  onClose: (hideDays: number | null) => void;
  /** false면 이동 URL 클릭과 "N일간 보지 않기" 체크가 비활성화된다. 어드민 미리보기 전용. */
  interactive?: boolean;
};

/**
 * 위치(fixed 좌표)는 부모(NoticePopupManager)의 스택 컨테이너가 담당한다 — 이 컴포넌트는
 * 그 안에 놓이는 한 장의 카드일 뿐이라 relative 포지셔닝만 갖는다.
 */
export function NoticePopupCard({ popup, onClose, interactive = true }: Props) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const dontShowAgainRef = useRef(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    dontShowAgainRef.current = dontShowAgain;
  }, [dontShowAgain]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      onClose(dontShowAgainRef.current ? popup.hide_duration_days : null);
    }, ANIMATION_MS);
  }

  const image = (
    // 잘리거나 다른 색으로 채워지지 않도록 원본 비율 그대로 너비에 맞춰 높이가 자동으로 정해진다.
    // (업로드 시 투명 여백은 trimTransparentPadding으로 이미 제거됨 — bg-white는 안티앨리어싱
    // 경계의 미세한 반투명 픽셀만을 위한 안전망.)
    // Supabase 공개 URL — next.config에 remotePatterns가 없어 프로젝트 관례대로 일반 img 사용.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={popup.image_url}
      alt="공지 팝업"
      className="block h-auto w-full bg-white"
    />
  );

  return (
    <div
      role="dialog"
      aria-label="공지 팝업"
      aria-modal="false"
      className={cn(
        "relative flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-all duration-200 ease-out motion-reduce:transition-opacity",
        POPUP_SIZE_WIDTH_CLASS[popup.size],
        visible && !closing
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0 motion-reduce:translate-y-0",
      )}
    >
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={handleClose}
        className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-colors hover:bg-background"
      >
        <X className="size-4" />
      </button>

      {popup.target_url && interactive ? (
        <a
          href={popup.target_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {image}
        </a>
      ) : (
        image
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <label
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            !interactive && "cursor-not-allowed opacity-50",
          )}
        >
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            disabled={!interactive}
            className="size-4 accent-primary disabled:cursor-not-allowed"
          />
          {popup.hide_duration_days}일간 보지 않기
        </label>
        <button
          type="button"
          onClick={handleClose}
          className="text-sm font-medium text-foreground hover:underline"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
