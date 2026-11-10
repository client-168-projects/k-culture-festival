import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

type Props = {
  label: ReactNode;
  htmlFor?: string;
  children: ReactNode;
};

/** 라벨과 입력 컨트롤을 묶는 폼 필드 래퍼 */
export function FieldGroup({ label, htmlFor, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
