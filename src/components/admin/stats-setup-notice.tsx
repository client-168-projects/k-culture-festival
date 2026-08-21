import { AlertTriangle, BarChart3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const GA4_ENV_KEYS = [
  "GA4_PROPERTY_ID",
  "GA4_SERVICE_ACCOUNT_EMAIL",
  "GA4_SERVICE_ACCOUNT_PRIVATE_KEY",
];

export function StatsSetupNotice({ missing }: { missing: string[] }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <BarChart3 className="size-8 text-muted-foreground" />
        <p className="text-base font-medium">GA4 연동이 아직 설정되지 않았습니다.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          아래 환경변수 중 이 서버가 실제로 읽지 못하고 있는 값이 빨간색으로
          표시됩니다. 배포 환경의 변수 설정을 다시 확인해주세요.
        </p>
        <ul className="mt-1 flex flex-col gap-1 rounded-md bg-muted px-4 py-3 text-left font-mono text-xs">
          {GA4_ENV_KEYS.map((key) => {
            const isMissing = missing.includes(key);
            return (
              <li
                key={key}
                className={cn(
                  isMissing
                    ? "font-bold text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {isMissing ? "✗" : "✓"} {key}
              </li>
            );
          })}
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
