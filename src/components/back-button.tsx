"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full sm:w-auto"
      onClick={() => router.back()}
    >
      이전 페이지로 돌아가기
      <ArrowLeft className="size-4" />
    </Button>
  );
}
