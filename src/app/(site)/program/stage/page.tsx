import type { Metadata } from "next";

import { PageContainer, PageHeader } from "@/components/page-header";
import { StageProgramList } from "@/components/stage-program-list";
import { stagePrograms } from "@/data/stage-programs";

export const metadata: Metadata = {
  title: "무대 프로그램",
  description: "무대에서 진행되는 공연 및 행사 일정입니다.",
};

export default function StagePage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title="무대 프로그램" />

      <StageProgramList programs={stagePrograms} />
    </PageContainer>
  );
}
