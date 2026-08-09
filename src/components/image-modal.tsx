"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ImageModal({
  src,
  alt,
  width,
  height,
  children,
  className,
}: {
  src: string;
  alt: string;
  /** 이미지의 실제 가로 픽셀 크기. */
  width: number;
  /** 이미지의 실제 세로 픽셀 크기. */
  height: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="animate-drop-down fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "animate-drop-down fixed top-1/2 left-1/2 z-50 w-[95vw] -translate-x-1/2 -translate-y-1/2 outline-none sm:w-auto",
            className,
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {alt}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            확대된 이미지
          </DialogPrimitive.Description>

          {/* 모바일: 화면 너비의 95% 기준 확대. 데스크톱(sm~): 화면 높이의 90% 기준으로 확대하되, 그 결과 너비가 화면의 90%를 넘으면 너비 기준으로 전환. */}
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 640px) 90vw, 95vw"
            className="h-auto w-full sm:h-[90vh] sm:w-auto sm:max-w-[90vw]"
          />

          <DialogPrimitive.Close
            className="fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex size-10 items-center justify-center rounded-full bg-background/80 text-foreground opacity-90 shadow-md transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X className="size-5" />
            <span className="sr-only">닫기</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
