import { Truck, TreePine, UtensilsCrossed } from "lucide-react";

import { ArchPanel } from "@/components/arch-panel";

import { Container } from "./container";
import { FullscreenSection } from "./fullscreen-section";

const FOOD_ZONES = [
  { icon: Truck, label: "푸드 트럭 존" },
  { icon: UtensilsCrossed, label: "전통 먹거리 부스" },
  { icon: TreePine, label: "야외 피크닉존" },
] as const;

export function KFoodSection() {
  return (
    <FullscreenSection id="kfood" className="bg-brand-paper text-brand-ink">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <ArchPanel tone="vermillion" className="aspect-square lg:aspect-[1/1.05]">
          <svg viewBox="0 0 64 64" fill="none" className="h-[52%] w-[52%]">
            <circle
              cx="32"
              cy="32"
              r="24"
              stroke="var(--brand-paper)"
              strokeWidth="2.5"
            />
            <circle cx="26" cy="26" r="6" fill="var(--brand-paper)" />
            <path
              d="M16 40c8-6 24-6 32 0"
              stroke="var(--brand-paper)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </ArchPanel>

        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-brand-vermillion uppercase before:block before:h-0.5 before:w-4 before:bg-brand-vermillion">
            K-Food
          </span>
          <h2 className="mt-3 mb-4 font-heading text-[clamp(1.75rem,4vw,2.375rem)]">
            K-푸드
          </h2>
          <p className="mb-5.5 max-w-120 text-lg text-brand-ink-soft">
            축제 현장에서 만나는 다양한 K-푸드 먹거리 부스. 온 가족이 함께
            즐기는 한 끼가 기다립니다.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {FOOD_ZONES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-none border border-brand-ink/14 bg-white px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-vermillion/30 hover:shadow-sm sm:flex-col sm:items-start sm:gap-4 sm:py-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-vermillion/10 text-brand-vermillion">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-bold text-brand-ink">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </FullscreenSection>
  );
}
