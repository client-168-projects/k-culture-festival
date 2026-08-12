import { Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "전체 일정표",
  description: "파주 K-컬처 페스티벌의 전체 일정을 한눈에 확인하세요.",
  path: "/about/schedule",
});

const SCHEDULE_IMAGE_URL = "/assets/images/main/festival-schedule.png";

export default function SchedulePage() {
  return (
    <PageContainer>
      <PageHeader title="전체 일정표" />

      <div className="relative w-full overflow-hidden rounded-lg border border-border">
        <Image
          src={SCHEDULE_IMAGE_URL}
          alt="2026 K-컬처 페스티벌 축제 전체 일정표"
          width={1200}
          height={2476}
          sizes="(min-width: 1024px) 56rem, 100vw"
          className="h-auto w-full"
        />
      </div>

      <Button asChild variant="outline" className="self-start">
        <a href={SCHEDULE_IMAGE_URL} download>
          <Download className="size-4" />
          일정표 다운로드
        </a>
      </Button>
    </PageContainer>
  );
}
