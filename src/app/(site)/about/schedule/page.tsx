import type { Metadata } from "next";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "전체 일정표",
  description: "축제 전체 일정을 한눈에 확인하세요.",
};

const items = [
  { time: "10:00", title: "개회식" },
  { time: "11:00", title: "K-댄스 공연" },
  { time: "13:00", title: "마술공연 <K-MAGIC>" },
  { time: "15:00", title: "특별공연 <K-POP Class:y>" },
  { time: "17:00", title: "폐회식 및 경품 추첨" },
];

export default function SchedulePage() {
  return (
    <PageContainer>
      <PageHeader title="전체 일정표" />

      <Card>
        <CardContent>
          <ol className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.time}
                className="flex items-baseline gap-4 py-3 first:pt-0 last:pb-0"
              >
                <span className="w-16 shrink-0 font-mono text-sm text-muted-foreground">
                  {item.time}
                </span>
                <span className="text-base">{item.title}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Button variant="outline" className="self-start">
        리플렛 다운로드
      </Button>
    </PageContainer>
  );
}
