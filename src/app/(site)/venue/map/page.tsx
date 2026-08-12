import type { Metadata } from "next";
import { Construction } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "행사장 지도",
  description: "행사장 배치와 주요 시설 위치를 안내합니다.",
};

export default function MapPage() {
  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title="행사장 지도" />

      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-20 text-center">
        <Construction className="size-8 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">
          준비중입니다
        </p>
      </div>
    </PageContainer>
  );
}
