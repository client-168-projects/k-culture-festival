import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const TONE_GRADIENTS = {
  indigo: "bg-linear-to-br from-brand-indigo to-brand-indigo-deep",
  "indigo-deep": "bg-linear-to-br from-brand-indigo-deep to-brand-indigo",
  vermillion:
    "bg-linear-to-br from-brand-vermillion to-brand-vermillion-deep",
  jade: "bg-linear-to-br from-brand-jade to-brand-jade-deep",
  purple: "bg-linear-to-br from-brand-purple to-brand-purple-deep",
} as const;

type ArchTone = keyof typeof TONE_GRADIENTS;

/** 포스터의 4분할 아치 그래픽을 재해석한 시그니처 장식 패널. 히어로/무대/체험/K-푸드 섹션에서 공용으로 사용. */
export function ArchPanel({
  tone,
  square = false,
  flip = false,
  sharp = false,
  flatCorner,
  className,
  children,
}: {
  tone: ArchTone;
  square?: boolean;
  /** 아치를 위아래로 뒤집어 반원이 아래쪽에 오도록 함 (내용물은 그대로) */
  flip?: boolean;
  /** 아치의 둥근 모서리를 모두 없애고 각지게 함 */
  sharp?: boolean;
  /** 반원(아치)이 아닌 쪽 모서리만 완전히 각지게 함 (반원 쪽은 그대로 유지) */
  flatCorner?: "top" | "bottom";
  className?: string;
  children?: ReactNode;
}) {
  const cornerClasses = sharp
    ? "rounded-none"
    : square
      ? "rounded-arch"
      : flip
        ? `rounded-b-arch ${flatCorner === "top" ? "rounded-t-none" : "rounded-t-2xl"}`
        : `rounded-t-arch ${flatCorner === "bottom" ? "rounded-b-none" : "rounded-b-2xl"}`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        cornerClasses,
        TONE_GRADIENTS[tone],
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle,white_1.4px,transparent_1.4px)] before:bg-[length:16px_16px] before:opacity-[0.14]",
        className,
      )}
    >
      {children}
    </div>
  );
}
