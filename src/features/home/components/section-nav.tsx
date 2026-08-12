"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useNavHidden } from "@/stores/nav-visibility";

import { Container } from "./container";

const SECTIONS = [
  { id: "main-stage", label: "메인 무대" },
  { id: "experience", label: "체험 프로그램" },
  { id: "extra-program", label: "부대 프로그램" },
] as const;

/** 파란 정보 바를 재활용한 섹션 이동 네브바. 클릭 시 부드럽게 스크롤하고, 현재 보이는 섹션의 라벨을 강조한다. */
export function SectionNav() {
  const navHidden = useNavHidden();
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveId(mostVisible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="섹션 바로가기"
      className={cn(
        "sticky z-40 overflow-hidden bg-brand-indigo py-4 transition-[top] duration-300",
        navHidden ? "top-0" : "top-20 sm:top-24",
      )}
    >
      <Container className="flex flex-wrap justify-center gap-x-9 gap-y-1.5">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() =>
              document
                .getElementById(section.id)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={cn(
              "text-sm font-bold tracking-[0.06em] transition-colors",
              activeId === section.id
                ? "text-brand-gold"
                : "text-brand-paper/80 hover:text-brand-paper",
            )}
          >
            {section.label}
          </button>
        ))}
      </Container>
    </nav>
  );
}
