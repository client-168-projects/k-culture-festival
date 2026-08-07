import type { Metadata } from "next";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "축제개요",
  description: "축제의 취지와 주요 특징을 소개합니다.",
};

const info = [
  { label: "명칭", value: "K-컬처 페스티벌" },
  { label: "기간", value: "2026년 9월 12일(토)" },
  { label: "장소", value: "경기미래교육 파주캠퍼스" },
];

export default function OverviewPage() {
  return (
    <PageContainer>
      <PageHeader
        title="축제개요"
        description="축제의 취지와 주요 특징을 소개합니다."
      />

      <div className="grid gap-6 sm:grid-cols-[minmax(0,220px)_1fr]">
        <MediaPlaceholder label="축제 포스터" className="aspect-3/4 w-full" />

        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">축제 정보</h2>
              <dl className="flex flex-col gap-2">
                {info.map((item) => (
                  <div key={item.label} className="flex gap-3 text-base">
                    <dt className="w-16 shrink-0 text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">축제 소개</h2>
            <p className="text-muted-foreground">
              지역 청소년과 시민이 함께 만드는 K-컬처 축제입니다. 무대 공연,
              체험 프로그램, 다양한 부대 행사를 통해 하루 종일 즐길 거리로
              가득한 축제 현장을 만나보세요.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
