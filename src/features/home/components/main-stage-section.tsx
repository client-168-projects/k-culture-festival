import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ArchPanel } from "./arch-panel";
import { Container } from "./container";
import { FullscreenSection } from "./fullscreen-section";
import { SectionHead } from "./section-head";

const LINEUP = [
  {
    tone: "indigo",
    tag: "HEADLINER",
    name: "김태우",
    role: "메인 무대 공연",
    feat: true,
  },
  {
    tone: "vermillion",
    tag: "HEADLINER",
    name: "CLASSy",
    role: "메인 무대 공연",
    feat: true,
  },
  {
    tone: "jade",
    tag: "GUEST",
    name: "마술사 김민형",
    role: "Eris · 비보이즈 · 주황규",
    feat: false,
  },
] as const;

export function MainStageSection() {
  return (
    <FullscreenSection className="bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.06)_1px,transparent_0)] bg-size-[22px_22px] text-brand-ink">
      <Container>
        <SectionHead
          eyebrow="Main Stage"
          title="메인 무대 공연"
          description="축제의 중심이 될 무대, 다채로운 라인업을 만나보세요."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LINEUP.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-b-2xl border border-brand-ink/14 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <ArchPanel
                tone={item.tone}
                className={cn(
                  "w-full transition-transform duration-200 group-hover:scale-[1.03]",
                  item.feat ? "h-40 sm:h-44" : "h-28 sm:h-32",
                )}
              />
              <div className="px-5 pt-4.5 pb-5.5">
                <span className="text-xs font-bold tracking-[0.08em] text-brand-vermillion">
                  {item.tag}
                </span>
                <div
                  className={cn(
                    "mt-1.5 font-display",
                    item.feat ? "text-[28px]" : "text-2xl",
                  )}
                >
                  {item.name}
                </div>
                <div className="mt-1 text-sm text-brand-ink-soft">
                  {item.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl bg-brand-jade px-6 py-6 text-brand-paper sm:px-8 sm:py-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,white_1.4px,transparent_1.4px)] bg-size-[16px_16px] opacity-[0.12]"
          />
          <div className="relative flex items-center gap-4">
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-brand-paper/15 sm:flex">
              <MapPin className="size-6" />
            </span>
            <div>
              <div className="font-display text-2xl">K-전통놀이</div>
              <div className="mt-1 text-sm opacity-85">
                전통 놀이 체험 부스에서 즐기는 우리 문화
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="relative h-auto rounded-[10px] border-[1.5px] border-brand-paper bg-transparent px-6 py-3.5 text-base font-bold text-brand-paper hover:bg-brand-paper/10"
          >
            부스 위치 보기
          </Button>
        </div>
      </Container>
    </FullscreenSection>
  );
}
