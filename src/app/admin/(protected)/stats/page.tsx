import { Suspense } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatsDashboard } from "@/components/admin/stats-dashboard";
import { StatsErrorNotice, StatsSetupNotice } from "@/components/admin/stats-setup-notice";
import { StatsSkeleton } from "@/components/admin/stats-skeleton";
import { getGA4Summary } from "@/lib/ga4";

async function StatsContent() {
  const result = await getGA4Summary();
  if (result.status === "unconfigured") return <StatsSetupNotice missing={result.missing} />;
  if (result.status === "error") return <StatsErrorNotice message={result.message} />;
  return <StatsDashboard summary={result.data} />;
}

export default function StatsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader>통계</AdminPageHeader>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsContent />
      </Suspense>
    </div>
  );
}
