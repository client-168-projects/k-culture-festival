import type { Metadata } from "next";

import { PageContainer, PageHeader } from "@/components/page-header";
import { StageProgramList } from "@/components/stage-program-list";
import { stagePrograms } from "@/data/stage-programs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "무대 프로그램",
  description: "파주k-컬처페스티벌 무대에서 진행되는 공연 및 행사 일정을 안내합니다.",
  path: "/program/stage",
});

export default function StagePage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title="무대 프로그램" />

      <StageProgramList programs={stagePrograms} />
    </PageContainer>
  );
}
