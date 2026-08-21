import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GA4Summary } from "@/lib/ga4";

function formatGA4Date(raw: string): string {
  if (raw.length !== 8) return raw;
  return `${raw.slice(4, 6)}/${raw.slice(6, 8)}`;
}

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
  const maxVisitors = Math.max(1, ...summary.dailyTrend.map((d) => d.visitors));

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
              <div className="flex h-40 items-end gap-2">
                {summary.dailyTrend.map((day) => (
                  <div
                    key={day.date}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex h-32 w-full items-end">
                      <div
                        className="w-full rounded-t-sm bg-brand-cobalt"
                        style={{
                          height: `${Math.max(4, (day.visitors / maxVisitors) * 100)}%`,
                        }}
                        title={`${day.visitors.toLocaleString("ko-KR")}명`}
                      />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatGA4Date(day.date)}
                    </span>
                  </div>
                ))}
              </div>
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
    </div>
  );
}
