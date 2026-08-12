import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-16",
        className,
      )}
    >
      {children}
    </main>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
