import { ArrowRight, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EXPERIENCE_CATEGORY_STYLE } from "@/constants/experience-category";
import { experiencePrograms } from "@/data/experience-programs";
import { cn } from "@/lib/utils";

import { Container } from "./container";
import { FullscreenSection } from "./fullscreen-section";
import { SectionHead } from "./section-head";

const HIGHLIGHT_ORDER = [
  "컬러 비즈 액막이 명태 만들기",
  "키캡키링 만들기",
  "나만의 LED-K응원봉 만들기",
  "자개 스티커 손거울 만들기",
  "달고나 만들기",
];

const highlights = HIGHLIGHT_ORDER.map(
  (title) => experiencePrograms.find((program) => program.title === title)!,
);
const [featured, ...restHighlights] = highlights;

const REST_POSITION = [
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-2 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
];

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <span
      className={cn(
        "absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold",
        EXPERIENCE_CATEGORY_STYLE[category] ?? "bg-brand-paper text-brand-ink",
      )}
    >
      {category}
    </span>
  );
}

function NumberBadge({ n }: { n: number }) {
  return (
    <span className="absolute bottom-3 left-3 flex size-7 items-center justify-center rounded-md bg-brand-ink/70 text-xs font-bold text-brand-paper backdrop-blur-sm">
      {String(n).padStart(2, "0")}
    </span>
  );
}

function AiImageNotice() {
  return (
    <span className="absolute right-2 bottom-2 rounded-sm bg-brand-ink/60 px-1.5 py-0.5 text-[10px] text-brand-paper/90 backdrop-blur-sm">
      예시이미지
    </span>
  );
}

function Sparkle({
  flip = false,
  className,
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/assets/images/main/sparkle.png"
      alt=""
      width={40}
      height={60}
      className={cn("h-7 w-auto shrink-0", flip && "rotate-180", className)}
    />
  );
}

function InfoRow({
  capacity,
  sessions,
  size = "base",
}: {
  capacity: string;
  sessions: string;
  size?: "base" | "sm";
}) {
  const iconSize = size === "base" ? "size-4" : "size-3.5";
  const textSize = size === "base" ? "text-sm" : "text-xs";
  return (
    <div className={cn("flex items-center gap-4 text-brand-indigo-mist", textSize)}>
      <span className="flex items-center gap-1.5">
        <Users className={iconSize} />
        {capacity}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className={iconSize} />
        {sessions}
      </span>
    </div>
  );
}

export function ExperienceSection() {
  return (
    <FullscreenSection
      id="experience"
      className="bg-brand-indigo-deep bg-[radial-gradient(circle_at_1px_1px,rgba(248,242,230,0.06)_1px,transparent_0)] bg-size-[22px_22px] text-brand-paper"
    >
      <Container className="relative w-full max-w-352.5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Experience"
            title="체험 프로그램"
            description="만들고, 즐기고, 직접 경험하는 다양한 K-Culture 체험이 기다립니다."
            invert
          />
          <div className="mb-6 w-full text-center sm:w-auto">
            <div className="font-display text-6xl text-brand-gold">
              {experiencePrograms.length}
            </div>
            <div className="text-lg font-bold tracking-[0.2em]">
              EXPERIENCE
            </div>
            <p className="mt-2 text-base text-brand-indigo-mist">
              다양한 체험 프로그램이
              <br />
              축제 곳곳에 준비되어 있어요!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:grid-rows-2 lg:gap-4">
          {/* 대표 카드 */}
          <div className="group flex flex-col overflow-hidden border border-brand-paper/16 bg-brand-paper/6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-paper/30 lg:col-start-1 lg:row-start-1 lg:row-span-2">
            <div className="relative aspect-4/3 w-full flex-1 overflow-hidden lg:aspect-auto">
              <Image
                src={featured.imageUrl!}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <CategoryBadge category={featured.category} />
              <NumberBadge n={1} />
              <AiImageNotice />
            </div>
            <div className="flex flex-col gap-2 px-5 py-4">
              <h3 className="font-display text-2xl leading-snug">
                {featured.title}
              </h3>
              <InfoRow capacity={featured.capacity} sessions={featured.sessions} />
            </div>
          </div>

          {/* 나머지 4개 */}
          {restHighlights.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "group overflow-hidden border border-brand-paper/16 bg-brand-paper/6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-paper/30",
                REST_POSITION[index],
              )}
            >
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                  src={item.imageUrl!}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <CategoryBadge category={item.category} />
                <NumberBadge n={index + 2} />
                <AiImageNotice />
              </div>
              <div className="px-4 py-2.5">
                <h3 className="font-display text-lg leading-snug">
                  {item.title}
                </h3>
                <div className="mt-1">
                  <InfoRow
                    capacity={item.capacity}
                    sessions={item.sessions}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* 프로모 카드 */}
          <div className="flex flex-col overflow-hidden border border-brand-gold/30 bg-brand-paper/6 lg:col-start-4 lg:row-start-1 lg:row-span-2 lg:self-end">
            {/* 조명/천막 이미지 — 패딩 없이 꽉 채움 */}
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src="/assets/images/main/festival-tent.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-1 px-6 py-5 text-center">
              <span className="text-2xl text-brand-gold italic">More</span>
              <div className="flex items-center gap-4">
                <Sparkle className="h-16" />
                <span className="font-display text-8xl text-brand-paper">
                  {experiencePrograms.length}
                </span>
                <Sparkle flip className="h-16" />
              </div>
              <p className="mt-2 text-sm text-brand-indigo-mist">
                다양한 체험 부스가
                <br />
                축제 곳곳에 준비되어 있어요!
              </p>
              <Link
                href="/program/experience"
                className="mt-4 inline-flex items-center gap-2 rounded-full border-[1.5px] border-brand-gold px-6 py-3 text-sm font-bold text-brand-gold hover:bg-brand-gold/10"
              >
                체험 프로그램 전체 보기
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-brand-indigo-mist/70">
          이해를 돕기 위한 AI 생성 예시 이미지이며, 실제와 다를 수 있습니다.
        </p>

        {/* 하단 스트립 */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-6">
          <Image
            src="/assets/images/main/emoji-left-2.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-auto sm:h-16"
          />
          <Image
            src="/assets/images/main/emoji-left.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-auto sm:h-16"
          />
          <p className="font-handwriting text-sm sm:text-xl">
            보고, 만들고, 즐기는{" "}
            <span className="text-brand-gold">K-Culture!</span>
          </p>
          <Image
            src="/assets/images/main/emoji-right.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-auto sm:h-16"
          />
          <Image
            src="/assets/images/main/emoji-right-2.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-auto sm:h-16"
          />
        </div>
      </Container>
    </FullscreenSection>
  );
}
