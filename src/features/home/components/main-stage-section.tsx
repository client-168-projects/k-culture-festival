import { Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ArchPanel, type ArchTone } from "@/components/arch-panel";
import { Button } from "@/components/ui/button";
import { stagePrograms } from "@/data/stage-programs";
import { cn } from "@/lib/utils";

import { Container } from "./container";
import { FullscreenSection } from "./fullscreen-section";
import { SectionHead } from "./section-head";

const SPECIAL_TONES: ArchTone[] = ["indigo", "vermillion", "jade"];

const SPECIAL_IMAGES: Record<string, string> = {
  김태우: "/assets/images/main/김태우-메인.png",
  CLASSy: "/assets/images/main/클라씨-메인.png",
  "마술사 김민형": "/assets/images/main/김민형-메인.png",
};

const specialLineup = stagePrograms
  .filter((item) => item.category === "특별공연")
  .slice(0, 3)
  .map((item, index) => ({ ...item, tone: SPECIAL_TONES[index] }));

const restLineup = stagePrograms.filter(
  (item) => item.category !== "특별공연",
);

const totalArtistCount = stagePrograms.reduce(
  (sum, item) => sum + (item.memberCount ?? 1),
  0,
);

const LINEUP_ROWS: { name: string; tone?: ArchTone }[][] = [
  specialLineup.map(({ name, tone }) => ({ name, tone })),
  restLineup.slice(0, 4).map(({ name }) => ({ name })),
  restLineup.slice(4).map(({ name }) => ({ name })),
];

const TONE_TEXT: Record<ArchTone, string> = {
  indigo: "text-brand-indigo",
  "indigo-deep": "text-brand-indigo-deep",
  vermillion: "text-brand-vermillion",
  jade: "text-brand-jade",
  purple: "text-brand-purple",
};

export function MainStageSection() {
  return (
    <FullscreenSection
      id="main-stage"
      className="bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.06)_1px,transparent_0)] bg-size-[22px_22px] text-brand-ink"
    >
      <Container>
        <SectionHead
          eyebrow="Main Stage"
          title="메인 무대 공연"
          description="축제의 중심이 될 무대, 다채로운 라인업을 만나보세요."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
          <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {specialLineup.map((item) => (
              <div
                key={item.name}
                className="group relative overflow-hidden transition-all duration-200 hover:z-10 hover:-translate-y-1 hover:scale-[1.03]"
              >
                {/* 호버 시 유리 반사 효과 */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 translate-x-[-150%] skew-x-[-20deg] bg-linear-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-[150%] group-hover:transition-transform group-hover:duration-700 group-hover:ease-out"
                />
                <ArchPanel
                  tone={item.tone}
                  flatCorner="bottom"
                  className="h-56 w-full sm:h-64"
                >
                  <div
                    className={cn(
                      "absolute inset-0",
                      item.name === "CLASSy" &&
                        "inset-x-[14%] top-[12%] bottom-0 sm:inset-0",
                    )}
                  >
                    <Image
                      src={SPECIAL_IMAGES[item.name]}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain object-bottom"
                    />
                  </div>
                </ArchPanel>
                <div className="border border-brand-ink/14 bg-white px-5 pt-4.5 pb-5.5 shadow-sm">
                  <span className="text-xs font-bold tracking-[0.08em] text-brand-vermillion">
                    {item.category}
                  </span>
                  <div className="mt-1.5 font-display text-[28px]">
                    {item.name}
                  </div>
                  <div className="mt-1 text-sm text-brand-ink-soft">
                    {item.genre}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex h-full flex-col justify-center px-2 py-4 sm:px-4">
            <div className="flex items-center justify-center gap-4 text-brand-vermillion">
              <span className="h-px flex-1 bg-brand-vermillion/30" />
              <span className="text-lg font-bold tracking-[0.2em]">
                {totalArtistCount} ARTISTS
              </span>
              <span className="h-px flex-1 bg-brand-vermillion/30" />
            </div>

            <div className="mt-8 flex flex-col divide-y divide-dashed divide-brand-ink/15">
              {LINEUP_ROWS.map((row, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-center gap-x-7 gap-y-4 py-6 first:pt-0 last:pb-0"
                >
                  {row.map((artist) => (
                    <span
                      key={artist.name}
                      className={cn(
                        "font-display",
                        index === 0 ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl",
                        artist.tone ? TONE_TEXT[artist.tone] : "text-brand-ink",
                      )}
                    >
                      {artist.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-12 flex flex-col flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl bg-brand-jade px-6 py-10 text-center text-brand-paper sm:mt-14 sm:flex-row sm:px-8 sm:py-12 sm:text-left">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,white_1.4px,transparent_1.4px)] bg-size-[16px_16px] opacity-[0.12]"
          />
          <div className="relative flex flex-col items-center gap-4 sm:flex-row">
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-brand-paper/15 sm:flex">
              <Music2 className="size-6" />
            </span>
            <div>
              <div className="font-display text-2xl">무대 프로그램</div>
              <div className="mt-1 text-sm opacity-85">
                9월 12일 하루 종일 이어지는 공연 라인업을 확인해보세요
              </div>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="relative h-auto rounded-[10px] border-[1.5px] border-brand-paper bg-transparent px-6 py-3.5 text-base font-bold text-brand-paper hover:bg-brand-paper/10 hover:text-brand-paper"
          >
            <Link href="/program/stage">무대 프로그램 보기</Link>
          </Button>
        </div>
      </Container>
    </FullscreenSection>
  );
}
