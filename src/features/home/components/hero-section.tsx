import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Container } from "./container";
import { KMarkGraphic } from "./k-mark-graphic";

export function HeroSection() {
  return (
    <header className="flex flex-1 flex-col bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.07)_1px,transparent_0)] bg-size-[22px_22px] py-10 text-brand-ink sm:py-12">
      <Container className="flex max-w-300 flex-1 flex-col px-0 sm:px-0">
        <div className="mb-6 flex items-center justify-end gap-2.5 px-5 sm:mb-8 sm:px-8">
          <span className="text-xs font-bold text-brand-ink-soft sm:text-sm">
            <span className="font-medium text-brand-ink-soft/70">주최</span>{" "}
            경기도
            <span className="mx-2 text-brand-ink-soft/40">·</span>
            <span className="font-medium text-brand-ink-soft/70">주관</span>{" "}
            경기도평생교육진흥원
          </span>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 xl:gap-32">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-shadow-poster mb-7 font-heading text-[clamp(3rem,6.5vw,7rem)] leading-[0.98] text-brand-indigo">
              <span className="block">파주</span>
              <span className="block">K-컬처</span>
              <span className="block">페스티벌</span>
            </h1>

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

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button className="h-auto gap-2.5 rounded-full bg-brand-vermillion px-7 py-4 text-lg font-bold text-brand-paper shadow-md shadow-brand-vermillion/25">
                <MapPin className="size-5" />
                경기미래교육 파주캠퍼스
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto gap-2.5 rounded-full border-2 border-brand-vermillion bg-transparent px-7 py-4 text-lg font-bold text-brand-vermillion transition-all hover:-translate-y-0.5 hover:bg-brand-vermillion/10 hover:text-brand-vermillion"
              >
                <Link href="/venue/directions">
                  오시는 길
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>

          <KMarkGraphic />
        </div>
      </Container>
    </header>
  );
}
