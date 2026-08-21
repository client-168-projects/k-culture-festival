import { BarChart3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function StatsSetupNotice() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <BarChart3 className="size-8 text-muted-foreground" />
        <p className="text-base font-medium">GA4 연동이 아직 설정되지 않았습니다.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Google Cloud 서비스 계정을 만들고 GA4 속성에 뷰어 권한으로 추가한 뒤, 아래
          환경변수를 설정하면 이 화면에 통계가 표시됩니다.
        </p>
        <ul className="mt-1 flex flex-col gap-1 rounded-md bg-muted px-4 py-3 text-left font-mono text-xs text-muted-foreground">
          <li>GA4_PROPERTY_ID</li>
          <li>GA4_SERVICE_ACCOUNT_EMAIL</li>
          <li>GA4_SERVICE_ACCOUNT_PRIVATE_KEY</li>
        </ul>
      </CardContent>
    </Card>
  );
}
