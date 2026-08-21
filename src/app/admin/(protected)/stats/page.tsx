import { Suspense } from "react";

import { StatsDashboard } from "@/components/admin/stats-dashboard";
import { StatsErrorNotice, StatsSetupNotice } from "@/components/admin/stats-setup-notice";
import { StatsSkeleton } from "@/components/admin/stats-skeleton";
import { getGA4Summary } from "@/lib/ga4";

async function StatsContent() {
  const result = await getGA4Summary();
  if (result.status === "unconfigured") return <StatsSetupNotice />;
  if (result.status === "error") return <StatsErrorNotice message={result.message} />;
  return <StatsDashboard summary={result.data} />;
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
