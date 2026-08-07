import type { Metadata } from "next";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "부대프로그램",
  description: "축제와 함께 즐길 수 있는 부대 프로그램입니다.",
};

const items = [
  { title: "양궁체험" },
  { title: "전통놀이존" },
  { title: "인생네컷" },
  { title: "삐에로 풍선" },
  { title: "플리마켓" },
  { title: "K-푸드 간식" },
];

export default function ExtraPage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader
        title="부대프로그램"
        description="축제와 함께 즐길 수 있는 부대 프로그램입니다."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-3">
            <MediaPlaceholder label={item.title} className="aspect-square" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary">상시운영</Badge>
              <p className="text-base">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
