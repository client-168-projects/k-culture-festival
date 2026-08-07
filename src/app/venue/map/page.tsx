import type { Metadata } from "next";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "행사장 지도",
  description: "행사장 배치와 주요 시설 위치를 안내합니다.",
};

export default function MapPage() {
  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        title="행사장 지도"
        description="행사장 배치와 주요 시설 위치를 안내합니다."
      />

      <MediaPlaceholder label="행사장 지도" className="aspect-video w-full" />

      <Button variant="outline" className="self-start">
        행사장 지도 다운로드
      </Button>
    </PageContainer>
  );
}
