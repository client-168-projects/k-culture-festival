import type { Metadata } from "next";

import { ExtraProgramList } from "@/components/extra-program-list";
import { PageContainer, PageHeader } from "@/components/page-header";
import { extraPrograms } from "@/data/extra-programs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "부대프로그램",
  description: "파주 K-컬처 페스티벌과 함께 즐길 수 있는 부대 프로그램을 안내합니다.",
  path: "/program/extra",
});

export default function ExtraPage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title="부대프로그램" />

      <ExtraProgramList programs={extraPrograms} />
    </PageContainer>
  );
}
