import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Notice } from "@/types/notice";

export function NoticeList({ notices }: { notices: Notice[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {notices.map((notice) => {
        const pinned = notice.is_pinned === 1;
        return (
          <li key={notice.id} className="py-1 first:pt-0 last:pb-0">
            <Link
              href={`/community/notice/${notice.id}`}
              className={cn(
                "flex w-full items-center justify-between gap-4 py-2 text-left hover:text-brand-vermillion",
                pinned && "bg-brand-vermillion/10 px-3 font-bold text-brand-vermillion",
              )}
            >
              <span className="text-base">
                {pinned ? <span className="mr-1 text-sm">📌</span> : null}
                {notice.title}
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span
                  className={cn(
                    "font-mono text-sm",
                    pinned ? "text-brand-vermillion" : "text-muted-foreground",
                  )}
                >
                  {notice.created_at.slice(0, 10)}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
