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
        priority
        className="pointer-events-none absolute bottom-0 left-0 -z-10 hidden h-auto w-88 animate-hero-slide-left sm:block md:w-120 lg:w-155 xl:w-185"
      />
      <Image
        src="/assets/images/main/background-right-bottom.png"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        priority
        className="pointer-events-none absolute right-0 bottom-0 -z-10 hidden h-auto w-130 animate-hero-slide-right sm:block md:w-175 lg:w-225 xl:w-270"
      />

      <Container className="flex max-w-352.5 flex-1 flex-col px-5 sm:px-10 lg:px-0">
        <div className="-mt-4 grid flex-1 grid-cols-1 items-center gap-10 sm:-mt-6 lg:-mt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div
              className="mb-7 flex animate-hero-reveal items-center justify-center gap-2 sm:justify-end sm:gap-6 lg:justify-start"
              style={{ animationDelay: "1300ms" }}
            >
              <h1 className="sr-only">파주 K-컬처 페스티벌</h1>

              <div className="relative h-32 w-44 shrink-0 sm:h-64 sm:w-80 lg:hidden">
                <Image
                  src="/assets/logo/kculture-festival-logo.png"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 640px) 320px, 176px"
                  className="object-contain object-right"
                />
              </div>

              <div
                aria-hidden="true"
                className="text-shadow-poster hidden font-heading text-[clamp(3.5rem,7.2vw,8.5rem)] leading-[0.98] text-brand-indigo lg:block"
              >
                <span className="block">파주</span>
                <span className="block">K-컬처</span>
                <span className="block">페스티벌</span>
              </div>

              <div className="relative h-32 w-32 shrink-0 sm:h-64 sm:w-64 lg:hidden">
                <Image
                  src="/assets/images/k-shape-main-image.png"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 640px) 256px, 128px"
                  className="object-contain"
                />
              </div>
            </div>

            <div
              aria-hidden="true"
              className="mb-4 flex items-center justify-center gap-2 opacity-70 sm:justify-start sm:gap-3 sm:opacity-40 lg:ml-12"
            >
              <span className="h-px w-20 bg-linear-to-r from-transparent to-brand-gold sm:w-28" />
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-3.5 shrink-0 text-brand-gold sm:size-4"
              >
                <path d="M12 12C9.8 9.6 9.8 5.8 12 3C14.2 5.8 14.2 9.6 12 12Z" />
                <path d="M12 12C14.2 14.4 14.2 18.2 12 21C9.8 18.2 9.8 14.4 12 12Z" />
                <path d="M12 12C9.6 9.8 5.8 9.8 3 12C5.8 14.2 9.6 14.2 12 12Z" />
                <path d="M12 12C14.4 9.8 18.2 9.8 21 12C18.2 14.2 14.4 14.2 12 12Z" />
              </svg>
              <span className="h-px w-20 bg-linear-to-l from-transparent to-brand-gold sm:w-28" />
            </div>

            <div
              className="mb-9 flex animate-hero-reveal items-center gap-3"
              style={{ animationDelay: "1550ms" }}
            >
              <CalendarDays className="size-6 text-brand-vermillion" />
              <span className="font-display text-2xl text-brand-vermillion sm:text-3xl">
                2026. 9. 12.(토)
              </span>
            </div>

            <div
              className="flex animate-hero-reveal flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:items-start lg:justify-start"
              style={{ animationDelay: "1700ms" }}
            >
              <Button className="h-auto w-full gap-2.5 rounded-full bg-brand-vermillion px-7 py-4 text-lg font-bold text-brand-paper shadow-md shadow-brand-vermillion/25 sm:w-auto">
                <MapPin className="size-5" />
                경기미래교육파주캠퍼스
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
            <KMarkGraphic startDelayMs={1900} />
          </div>
        </div>
      </Container>
    </header>
  );
}
