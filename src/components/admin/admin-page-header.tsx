import type { ReactNode } from "react";

/** admin 페이지 제목. 공개 사이트의 PageHeader와는 별개(스타일이 다름) — 합치지 말 것. */
export function AdminPageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>;
}
