"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
} from "recharts";

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

export function VisitorTrendChart({
  dailyTrend,
}: {
  dailyTrend: GA4Summary["dailyTrend"];
}) {
  return (
    <div className="h-full min-h-40 w-full flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dailyTrend} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
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
            interval="preserveStartEnd"
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
