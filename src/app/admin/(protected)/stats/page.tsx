import { Suspense } from "react";

import { StatsDashboard } from "@/components/admin/stats-dashboard";
import { StatsSetupNotice } from "@/components/admin/stats-setup-notice";
import { StatsSkeleton } from "@/components/admin/stats-skeleton";
import { getGA4Summary } from "@/lib/ga4";

async function StatsContent() {
  const summary = await getGA4Summary();
  if (!summary) return <StatsSetupNotice />;
  return <StatsDashboard summary={summary} />;
}

export default function StatsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">통계</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsContent />
      </Suspense>
    </div>
  );
}
