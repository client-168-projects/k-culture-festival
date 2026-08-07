import type { Metadata } from "next";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "공지사항",
  description: "축제 관련 공지사항을 확인하세요.",
};

const items = [
  { date: "2026-08-01", title: "K-컬처 페스티벌 참가 신청 안내" },
  { date: "2026-08-10", title: "체험 프로그램 사전신청 오픈 안내" },
  { date: "2026-08-20", title: "셔틀버스 운행 계획 공지" },
  { date: "2026-08-25", title: "우천 시 행사 진행 안내" },
  { date: "2026-09-01", title: "주차 및 교통 통제 안내" },
];

export default function NoticePage() {
  return (
    <PageContainer>
      <PageHeader
        title="공지사항"
        description="축제 관련 공지사항을 확인하세요."
      />

      <Card>
        <CardContent>
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="text-base">{item.title}</span>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {item.date}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
