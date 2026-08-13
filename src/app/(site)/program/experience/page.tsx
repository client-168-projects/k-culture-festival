import { Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { ExperienceProgramList } from "@/components/experience-program-list";
import { ImageModal } from "@/components/image-modal";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { experiencePrograms } from "@/data/experience-programs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "체험 프로그램",
  description: "파주 K-컬처 페스티벌에서 직접 참여할 수 있는 체험 프로그램을 안내합니다.",
  path: "/program/experience",
});

const EXPERIENCE_TABLE_IMAGE_URL = "/assets/images/체험프로그램%20테이블.png";

export default function ExperiencePage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title="체험 프로그램" />

      <div className="flex flex-col gap-3">
        <ImageModal
          src={EXPERIENCE_TABLE_IMAGE_URL}
          alt="체험존 안내"
          width={1301}
          height={1278}
        >
          <button
            type="button"
            className="relative mx-auto w-full max-w-4xl cursor-zoom-in overflow-hidden border border-border"
          >
            <Image
              src={EXPERIENCE_TABLE_IMAGE_URL}
              alt="체험존 안내"
              width={1301}
              height={1278}
              sizes="56rem"
              className="h-auto w-full"
            />
          </button>
        </ImageModal>

        <Button asChild variant="outline" className="mx-auto self-center">
          <a href={EXPERIENCE_TABLE_IMAGE_URL} download>
            <Download className="size-4" />
            이미지 다운로드
          </a>
        </Button>
      </div>

      <ExperienceProgramList programs={experiencePrograms} />
    </PageContainer>
  );
}
