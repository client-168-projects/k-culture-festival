import type { Metadata } from "next";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "무대 프로그램",
  description: "무대에서 진행되는 공연 및 행사 일정입니다.",
};

const items = [
  { title: "특별공연 <K-발라드 김태우>" },
  { title: "특별공연 <K-POP Classy>" },
  { title: "마술공연 <K-MAGIC 김민형마술사>" },
  { title: "파주 청소년수련관 <K-댄스>" },
  { title: "파주 청소년수련관 <K-보컬>" },
  { title: "공연 <다국적 걸그룹 이리즈>" },
  { title: "공연 <주황규>" },
  { title: "공연 <신인 I-DOL 비보이즈>" },
  { title: "레크레이션 <MC 조권>" },
];

export default function StagePage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader
        title="무대 프로그램"
        description="무대에서 진행되는 공연 및 행사 일정입니다."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-3">
            <MediaPlaceholder label={item.title} className="aspect-square" />
            <p className="text-base">{item.title}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
