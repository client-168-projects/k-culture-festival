import { ChevronDown } from "lucide-react";
import Image from "next/image";

import { ImageModal } from "@/components/image-modal";
import type { StageProgram } from "@/data/stage-programs";

export function StageProgramList({
  programs,
}: {
  programs: StageProgram[];
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="group flex flex-col border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-0.75 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)]"
        >
          <ImageModal
            src={item.image}
            alt={item.name}
            width={item.imageWidth}
            height={item.imageHeight}
          >
            <button
              type="button"
              className="relative aspect-16/10 w-full cursor-zoom-in overflow-hidden bg-card"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain transition-transform duration-200 ease-out group-hover:scale-[1.03]"
              />
            </button>
          </ImageModal>

          <div className="flex flex-col gap-1.5 px-4 py-4 sm:px-5">
            <span className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
              {item.category}
            </span>
            <span className="font-heading text-xs font-medium tracking-wide text-muted-foreground">
              {item.genre}
            </span>
            <span className="font-sans text-lg font-black tracking-tight">
              {item.name}
            </span>

            {item.note ? (
              <details className="group/note mt-1">
                <summary className="flex cursor-pointer list-none items-center justify-end gap-1 text-sm text-muted-foreground marker:hidden hover:text-foreground [&::-webkit-details-marker]:hidden">
                  공연 안내 보기
                  <ChevronDown className="size-3.5 transition-transform duration-200 group-open/note:rotate-180" />
                </summary>

                <div className="relative mt-2 flex overflow-hidden rounded-lg bg-brand-tangerine text-white before:absolute before:-top-1.5 before:right-8 before:size-3 before:rounded-full before:bg-card after:absolute after:-bottom-1.5 after:right-8 after:size-3 after:rounded-full after:bg-card">
                  <p className="flex-1 px-3.5 py-3 text-xs leading-relaxed font-semibold break-keep">
                    {item.note}
                  </p>
                  <div className="flex w-8 items-center justify-center border-l-2 border-dashed border-white/55 py-1.5 text-[10px] font-extrabold tracking-[0.15em] [writing-mode:vertical-rl]">
                    INFO
                  </div>
                </div>
              </details>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
