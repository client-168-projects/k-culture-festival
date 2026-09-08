import { Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "셔틀버스",
  description: "파주k-컬처페스티벌 셔틀버스 운행 시간과 탑승 장소를 안내합니다.",
  path: "/venue/shuttle",
});

const SHUTTLE_IMAGE_URL = "/assets/images/shuttle-info.png";

export default function ShuttlePage() {
  return (
    <PageContainer>
      <PageHeader title="셔틀버스" />

      <div className="relative w-full overflow-hidden rounded-lg border border-border">
        <Image
          src={SHUTTLE_IMAGE_URL}
          alt="셔틀버스 운행 안내"
          width={1081}
          height={1350}
          sizes="(min-width: 1024px) 56rem, 100vw"
          className="h-auto w-full"
        />
      </div>

      <Button asChild variant="outline" className="self-start">
        <a href={SHUTTLE_IMAGE_URL} download>
          <Download className="size-4" />
          셔틀버스 안내 다운로드
        </a>
      </Button>
    </PageContainer>
  );
}
