import { ImageIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function MediaPlaceholder({
  label,
  className,
  ...props
}: ComponentProps<"div"> & { label: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ImageIcon className="size-8" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
