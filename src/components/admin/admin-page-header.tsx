import type { ReactNode } from "react";

/** 어드민 페이지 제목 (공개 사이트 PageHeader와 스타일이 다름) */
export function AdminPageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>;
}
