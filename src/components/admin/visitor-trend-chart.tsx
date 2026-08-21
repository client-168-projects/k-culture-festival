"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
} from "recharts";

import { SegmentedToggle } from "@/components/admin/segmented-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GA4Summary } from "@/lib/ga4";

function formatGA4Date(raw: string): string {
  if (raw.length !== 8) return raw;
  return `${raw.slice(4, 6)}/${raw.slice(6, 8)}`;
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  const point = payload?.[0]?.payload as GA4Summary["dailyTrend"][number] | undefined;
  if (!active || !point) return null;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-sm">
      <p className="font-mono text-xs text-muted-foreground">{formatGA4Date(point.date)}</p>
      <p className="font-medium text-brand-cobalt">
        {point.visitors.toLocaleString("ko-KR")}명
      </p>
    </div>
  );
}

function TrendAreaChart({ data }: { data: GA4Summary["dailyTrend"] }) {
  // 날짜가 많아질수록 X축 라벨이 겹치지 않도록 대략 6개 정도만 보이게 건너뛴다.
  const tickInterval = data.length > 10 ? Math.ceil(data.length / 6) - 1 : "preserveStartEnd";

  return (
    <div className="h-full min-h-40 w-full flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="visitor-trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-cobalt)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--brand-cobalt)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatGA4Date}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            dy={8}
            interval={tickInterval}
          />
          <Tooltip content={ChartTooltip} />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="var(--brand-cobalt)"
            strokeWidth={2}
            fill="url(#visitor-trend-fill)"
            dot={{ r: 3, fill: "var(--brand-cobalt)", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VisitorTrendCard({
  dailyTrend,
  dailyTrendAllTime,
}: {
  dailyTrend: GA4Summary["dailyTrend"];
  dailyTrendAllTime: GA4Summary["dailyTrendAllTime"];
}) {
  const [range, setRange] = useState<"recent" | "all">("recent");
  const data = range === "recent" ? dailyTrend : dailyTrendAllTime;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>일별 방문자 추이</CardTitle>
        <SegmentedToggle
          value={range}
          onChange={setRange}
          options={[
            { value: "recent", label: "최근 7일" },
            { value: "all", label: "전체 누적" },
          ]}
        />
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {data.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            아직 수집된 데이터가 없습니다.
          </p>
        ) : (
          <TrendAreaChart data={data} />
        )}
      </CardContent>
    </Card>
  );
}
