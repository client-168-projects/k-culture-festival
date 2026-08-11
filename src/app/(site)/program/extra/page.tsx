import type { Metadata } from "next";

import { ExtraProgramList } from "@/components/extra-program-list";
import { PageContainer, PageHeader } from "@/components/page-header";
import { extraPrograms } from "@/data/extra-programs";

export const metadata: Metadata = {
  title: "부대프로그램",
  description: "축제와 함께 즐길 수 있는 부대 프로그램입니다.",
};

export default function ExtraPage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title="부대프로그램" />

      <ExtraProgramList programs={extraPrograms} />
    </PageContainer>
  );
}
