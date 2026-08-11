import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** 홈 섹션이 뷰포트 하나를 가득 채우도록 하는 공용 래퍼. */
export function FullscreenSection({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "relative flex min-h-dvh flex-col justify-center overflow-hidden py-16 sm:py-20",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
