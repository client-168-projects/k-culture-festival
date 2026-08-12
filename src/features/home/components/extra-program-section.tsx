import Image from "next/image";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { extraPrograms } from "@/data/extra-programs";
import { cn } from "@/lib/utils";

import { Container } from "./container";
import { FullscreenSection } from "./fullscreen-section";
import { SectionHead } from "./section-head";

const ROTATION = [
  "sm:-rotate-4 sm:mt-3",
  "sm:rotate-3 sm:-mt-1.5",
  "sm:-rotate-2 sm:mt-5",
  "sm:rotate-4",
  "sm:-rotate-3 sm:mt-4",
  "sm:rotate-2 sm:-mt-2",
];

const TAPE_COLOR = [
  "bg-brand-gold/75",
  "bg-brand-vermillion/70",
  "bg-brand-indigo/70",
];

function shortTag(schedule: (typeof extraPrograms)[number]["schedule"]) {
  if (schedule.type === "always") return "상시";
  if (schedule.type === "event") return schedule.label;
  return `${schedule.start}~${schedule.end}`;
}

export function ExtraProgramSection() {
  return (
    <FullscreenSection
      id="extra-program"
      className="justify-between bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.06)_1px,transparent_0)] bg-size-[22px_22px] pb-0 sm:pb-0 text-brand-ink"
    >
      <Container className="mt-16 w-full max-w-352.5 sm:mt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Playground"
            title="부대 프로그램"
            description="놀거리부터 먹거리까지, 축제 곳곳의 다양한 즐거움을 만나보세요"
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 sm:flex sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
          {extraPrograms.map((item, index) => {
            const isEvent = item.schedule.type === "event";
            return (
              <div
                key={item.title}
                className={cn(
                  "group relative bg-white p-2.5 pb-4 shadow-[0_10px_24px_-10px_rgba(33,27,18,0.28),0_2px_4px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out sm:max-w-48 sm:flex-1 sm:basis-36 hover:z-10 hover:-translate-y-1.5 hover:scale-105 hover:rotate-0",
                  ROTATION[index % ROTATION.length],
                )}
              >
                {/* 워시테이프 */}
                <span
                  className={cn(
                    "absolute -top-2.5 left-1/2 z-10 h-7 w-14 -translate-x-1/2 -rotate-3 shadow-sm",
                    TAPE_COLOR[index % TAPE_COLOR.length],
                  )}
                />

                <div className="relative aspect-square w-full overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(min-width: 640px) 12rem, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <MediaPlaceholder
                      label={item.title}
                      className="size-full rounded-none"
                    />
                  )}
                </div>

                <div className="pt-3 text-left">
                  <p className="mb-1.5 text-sm font-bold text-brand-indigo">
                    {item.title}
                  </p>
                  <span
                    className={cn(
                      "inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                      isEvent
                        ? "border-brand-vermillion bg-brand-vermillion text-brand-paper"
                        : "border-brand-indigo/30 text-brand-indigo",
                    )}
                  >
                    {shortTag(item.schedule)}
                  </span>
                  {item.note ? (
                    <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-brand-ink-soft/70">
                      {item.note}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      <div className="mt-12 bg-brand-vermillion px-6 py-10 text-center text-brand-paper sm:mt-14 sm:py-12">
        <h2 className="font-heading text-[clamp(1.625rem,4vw,2.125rem)] leading-snug">
          2026. 9. 12.(토), 파주에서 만나요
        </h2>
        <p className="mt-2 text-sm opacity-85">
          경기미래교육 파주캠퍼스 · 무료 체험 프로그램 사전 신청 가능
        </p>
      </div>
    </FullscreenSection>
  );
}
