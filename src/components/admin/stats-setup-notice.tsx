import { AlertTriangle, BarChart3 } from "lucide-react";

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

export function StatsErrorNotice({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <AlertTriangle className="size-8 text-destructive" />
        <p className="text-base font-medium">GA4 데이터를 불러오지 못했습니다.</p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          환경변수는 설정되어 있지만 API 호출이 실패했습니다. 서비스 계정에 GA4 속성
          뷰어 권한이 있는지, 속성 ID가 맞는지 확인해주세요.
        </p>
        <pre className="mt-1 w-full max-w-2xl overflow-x-auto rounded-md bg-muted px-4 py-3 text-left font-mono text-xs text-destructive">
          {message}
        </pre>
      </CardContent>
    </Card>
  );
}
