import { Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "행사장 지도",
  description: "파주k-컬처페스티벌 행사장 배치와 주요 시설 위치를 안내합니다.",
  path: "/venue/map",
});

const MAP_IMAGE_URL = "/assets/images/main/festival-map.webp";
const MAP_DOWNLOAD_URL = "/assets/images/main/festival-map.jpg";

export default function MapPage() {
  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title="행사장 지도" />

      <div className="relative w-full overflow-hidden rounded-lg border border-border">
        <Image
          src={MAP_IMAGE_URL}
          alt="파주k-컬처페스티벌 행사장 지도"
          width={1300}
          height={863}
          sizes="(min-width: 1024px) 56rem, 100vw"
          className="h-auto w-full"
        />
      </div>

      <Button asChild variant="outline" className="self-start">
        <a href={MAP_DOWNLOAD_URL} download>
          <Download className="size-4" />
          행사장 지도 다운로드
        </a>
      </Button>
    </PageContainer>
  );
}
