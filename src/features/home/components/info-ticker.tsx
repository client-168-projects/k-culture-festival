"use client";

import { useNavHidden } from "@/stores/nav-visibility";
import { cn } from "@/lib/utils";

import { Container } from "./container";

const ITEMS = [
  "파주 K-컬처 페스티벌",
  "2026. 9. 12. (토)",
  "경기미래교육 파주캠퍼스",
];

/** 원본 시안의 마퀴 애니메이션을 제거한 정적 정보 바. 네브바가 숨겨지면 맨 위로, 보이면 네브바 바로 아래로 붙는다. */
export function InfoTicker() {
  const navHidden = useNavHidden();

  return (
    <div
      role="presentation"
      className={cn(
        "sticky z-40 overflow-hidden bg-brand-indigo py-4 transition-[top] duration-300",                                                                                           
        navHidden ? "top-0" : "top-20 sm:top-24",
      )}
    >
      <Container className="flex flex-wrap justify-center gap-x-9 gap-y-1.5">
        {ITEMS.map((item) => (
          <span
            key={item}
            className="text-sm font-bold tracking-[0.06em] text-brand-paper"
          >
            {item}
          </span>
        ))}
      </Container>
    </div>
  );
}
