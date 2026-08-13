import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * 홈 섹션이 뷰포트 하나를 가득 채우도록 하는 공용 래퍼.
 * 섹션으로 스크롤해 들어오면 파란 섹션 네브바(3.375rem)가 항상 sticky로 남아있으므로,
 * 순수 100dvh를 쓰면 그만큼 하단 콘텐츠가 화면 아래로 잘려 보인다. 그래서 실제 보이는
 * 영역인 100dvh - 3.375rem을 기준으로 삼는다.
 */
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
