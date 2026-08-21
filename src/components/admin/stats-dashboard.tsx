import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisitorTrendChart } from "@/components/admin/visitor-trend-chart";
import { cn } from "@/lib/utils";
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
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="오늘 방문자" value={summary.activeUsersToday} />
        <StatCard label="최근 7일 방문자" value={summary.visitors7d} />
        <StatCard label="최근 7일 페이지뷰" value={summary.pageViews7d} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>일별 방문자 추이</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.dailyTrend.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                아직 수집된 데이터가 없습니다.
              </p>
            ) : (
              <VisitorTrendChart dailyTrend={summary.dailyTrend} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>인기 페이지 TOP 10</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.topPages.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                아직 수집된 데이터가 없습니다.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {summary.topPages.map((page) => {
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
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>공지사항별 누적 조회수</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.noticePages.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              아직 수집된 데이터가 없습니다.
            </p>
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
    </div>
  );
}
