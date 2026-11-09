import type { ReactNode } from "react";

// 공개 사이트의 PageHeader와 스타일이 달라 따로 둔다.
export function AdminPageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>;
}
