import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// 홈 섹션을 화면 높이만큼 채운다. sticky 섹션 네비(3.375rem)만큼 빼서 하단이 잘리지 않게 한다.
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
