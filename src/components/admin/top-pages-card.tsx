"use client";

import { useState } from "react";

import { SegmentedToggle } from "@/components/admin/segmented-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { GA4Summary } from "@/lib/ga4";

function PageList({ pages }: { pages: GA4Summary["topPages"] }) {
  if (pages.length === 0) {
    return <EmptyState message="아직 수집된 데이터가 없습니다." />;
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {pages.map((page) => {
        const pinned = page.path.startsWith("/community/notice");
        return (
          <li
            key={page.path}
            className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
          >
            <span
              className={cn(
                "truncate font-mono text-sm",
                pinned ? "text-brand-vermillion" : "text-foreground",
              )}
            >
              {page.path}
            </span>
            <span className="shrink-0 font-mono text-sm text-muted-foreground">
              {page.views.toLocaleString("ko-KR")}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function TopPagesCard({
  topPages,
  topPagesAllTime,
}: {
  topPages: GA4Summary["topPages"];
  topPagesAllTime: GA4Summary["topPagesAllTime"];
}) {
  const [range, setRange] = useState<"recent" | "all">("recent");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>인기 페이지 TOP 10</CardTitle>
        <SegmentedToggle
          value={range}
          onChange={setRange}
          options={[
            { value: "recent", label: "최근 7일" },
            { value: "all", label: "전체 누적" },
          ]}
        />
      </CardHeader>
      <CardContent>
        <PageList pages={range === "recent" ? topPages : topPagesAllTime} />
      </CardContent>
    </Card>
  );
}
