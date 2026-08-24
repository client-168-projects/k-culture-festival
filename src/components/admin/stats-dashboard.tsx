import Link from "next/link";

import { TopPagesCard } from "@/components/admin/top-pages-card";
import { VisitorTrendCard } from "@/components/admin/visitor-trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { GA4Summary } from "@/lib/ga4";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card variant="accent">
      <CardContent className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-3xl font-bold tracking-tight text-brand-cobalt">
          {value.toLocaleString("ko-KR")}
        </span>
      </CardContent>
    </Card>
  );
}

export function StatsDashboard({ summary }: { summary: GA4Summary }) {
  const maxTrafficUsers = Math.max(1, ...summary.trafficSources.map((s) => s.users));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="오늘 방문자" value={summary.activeUsersToday} />
        <StatCard label="최근 7일 방문자" value={summary.visitors7d} />
        <StatCard label="누적 메인페이지 조회수" value={summary.mainPageViewsAllTime} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VisitorTrendCard
          dailyTrend={summary.dailyTrend}
          dailyTrendAllTime={summary.dailyTrendAllTime}
        />
        <TopPagesCard topPages={summary.topPages} topPagesAllTime={summary.topPagesAllTime} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>공지사항별 누적 조회수</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.noticePages.length === 0 ? (
              <EmptyState message="아직 수집된 데이터가 없습니다." />
            ) : (
              <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                {summary.noticePages.map((page) => {
                  const id = page.path.replace("/community/notice/", "");
                  return (
                    <li
                      key={page.path}
                      className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2"
                    >
                      <Link
                        href={page.path}
                        target="_blank"
                        className="truncate font-mono text-sm text-brand-vermillion hover:underline"
                      >
                        공지 #{id}
                      </Link>
                      <span className="shrink-0 font-mono text-sm text-muted-foreground">
                        {page.views.toLocaleString("ko-KR")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>유입경로 (최근 7일)</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.trafficSources.length === 0 ? (
              <EmptyState message="아직 수집된 데이터가 없습니다." />
            ) : (
              <ul className="flex flex-col gap-1.5">
                {summary.trafficSources.map((source) => {
                  const percent = Math.max(4, (source.users / maxTrafficUsers) * 100);
                  return (
                    <li key={source.channel} className="relative overflow-hidden rounded-md">
                      <div
                        className="absolute inset-y-0 left-0 bg-brand-cobalt/10"
                        style={{ width: `${percent}%` }}
                      />
                      <div className="relative flex items-center justify-between gap-3 px-3 py-2">
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">{source.channel}</span>
                          {source.description ? (
                            <span className="truncate text-xs text-muted-foreground">
                              {source.description}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 font-mono text-sm text-muted-foreground">
                          {source.users.toLocaleString("ko-KR")}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
