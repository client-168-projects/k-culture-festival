import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** 홈 섹션을 한 화면 높이로 채우는 래퍼. sticky 섹션 네브바(3.375rem) 높이를 제외한다. */
export function FullscreenSection({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "relative flex min-h-[calc(100dvh-3.375rem)] scroll-mt-13.5 flex-col justify-center overflow-hidden py-16 sm:py-20",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
