import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto max-w-[1920px] px-5 sm:px-10", className)}
      {...props}
    />
  );
}
