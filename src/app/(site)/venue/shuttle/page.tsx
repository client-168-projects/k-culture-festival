import { Bus } from "lucide-react";
import type { Metadata } from "next";

import { PageContainer, PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "셔틀버스",
  description: "셔틀버스 운행 시간과 탑승 장소를 안내합니다.",
};

export default function ShuttlePage() {
  return (
    <PageContainer>
      <PageHeader title="셔틀버스" />

      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted py-16 text-center">
        <Bus className="size-8 text-muted-foreground" />
        <p className="text-muted-foreground">
          셔틀버스 운행 정보는 추후 공지될 예정입니다.
        </p>
      </div>
    </PageContainer>
  );
}
