import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Container } from "./container";
import { KMarkGraphic } from "./k-mark-graphic";

export function HeroSection() {
  return (
    <header className="relative z-0 flex flex-1 flex-col overflow-hidden bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.07)_1px,transparent_0)] bg-size-[22px_22px] py-10 text-brand-ink sm:py-12">
      <Image
        src="/assets/images/main/background-left-bottom.png"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        className="pointer-events-none absolute bottom-0 left-0 -z-10 hidden h-auto w-105 opacity-50 sm:block md:w-140 lg:w-180 xl:w-215"
      />
      <Image
        src="/assets/images/main/background-right-bottom.png"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        className="pointer-events-none absolute right-0 bottom-0 -z-10 hidden h-auto w-130 opacity-90 sm:block md:w-175 lg:w-225 xl:w-270"
      />

      <Container className="flex max-w-352.5 flex-1 flex-col px-0 sm:px-0">
        <div className="mb-6 flex items-center justify-end gap-2.5 px-5 sm:mb-8 sm:px-8">
          <span className="text-xs font-bold text-brand-ink-soft sm:text-sm">
            <span className="font-medium text-brand-ink-soft/70">주최</span>{" "}
            경기도
            <span className="mx-2 text-brand-ink-soft/40">·</span>
            <span className="font-medium text-brand-ink-soft/70">주관</span>{" "}
            경기도평생교육진흥원
          </span>
        </div>

        <div className="-mt-4 grid flex-1 grid-cols-1 items-center gap-10 sm:-mt-6 lg:-mt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-7 flex items-center justify-end gap-4 sm:gap-6 lg:justify-start">
              <h1 className="text-shadow-poster font-heading text-[clamp(3.5rem,7.2vw,8.5rem)] leading-[0.98] text-brand-indigo">
                <span className="block">파주</span>
                <span className="block">K-컬처</span>
                <span className="block">페스티벌</span>
              </h1>

              <div className="relative h-44 w-44 shrink-0 sm:h-64 sm:w-64 lg:hidden">
                <Image
                  src="/assets/images/k-shape-main-image.png"
                  alt=""
                  fill
                  sizes="256px"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="relative mb-4 mx-auto h-10 w-64 opacity-40 sm:h-12 sm:w-80 lg:mx-0 lg:ml-12">
              <Image
                src="/assets/images/divider-image.png"
                alt=""
                fill
                sizes="480px"
                className="object-cover"
              />
            </div>

            <div className="mb-9 flex items-center gap-3">
              <CalendarDays className="size-6 text-brand-vermillion" />
              <span className="font-display text-2xl text-brand-vermillion sm:text-3xl">
                2026. 9. 12.(토)
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:items-start lg:justify-start">
              <Button className="h-auto w-full gap-2.5 rounded-full bg-brand-vermillion px-7 py-4 text-lg font-bold text-brand-paper shadow-md shadow-brand-vermillion/25 sm:w-auto">
                <MapPin className="size-5" />
                경기미래교육 파주캠퍼스
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto w-full gap-2.5 rounded-full border-2 border-brand-vermillion bg-transparent px-7 py-4 text-lg font-bold text-brand-vermillion transition-all hover:-translate-y-0.5 hover:bg-brand-vermillion/10 hover:text-brand-vermillion sm:w-auto"
              >
                <Link href="/venue/directions">
                  오시는 길
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <KMarkGraphic />
          </div>
        </div>
      </Container>
    </header>
  );
}
