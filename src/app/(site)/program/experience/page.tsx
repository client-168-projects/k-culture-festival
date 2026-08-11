import type { Metadata } from "next";

import { ExperienceProgramList } from "@/components/experience-program-list";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { experiencePrograms } from "@/data/experience-programs";

export const metadata: Metadata = {
  title: "체험 프로그램",
  description: "직접 참여할 수 있는 체험 프로그램을 안내합니다.",
};

export default function ExperiencePage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title="체험 프로그램" />

      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,280px)] sm:items-start">
        <MediaPlaceholder label="체험존 안내" className="aspect-16/10 w-full" />
        <div className="flex flex-col gap-2 sm:pt-1">
          <h2 className="text-lg font-semibold">체험존 안내</h2>
          <p className="text-muted-foreground">
            행사장 곳곳에 마련된 체험존에서 다양한 K-컬처 콘텐츠를
            즐겨보세요.
          </p>
        </div>
      </div>

      <ExperienceProgramList programs={experiencePrograms} />
    </PageContainer>
  );
}
