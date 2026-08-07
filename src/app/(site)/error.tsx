"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
        문제가 발생했습니다
      </h1>
      <p className="max-w-sm text-muted-foreground">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </main>
  );
}
