"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { Notice } from "@/types/notice";

export function NoticeList({ notices }: { notices: Notice[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <ul className="flex flex-col divide-y divide-border">
      {notices.map((notice) => {
        const open = openId === notice.id;

        return (
          <li key={notice.id} className="py-1 first:pt-0 last:pb-0">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : notice.id)}
              className="flex w-full items-center justify-between gap-4 py-2 text-left"
              aria-expanded={open}
            >
              <span className="text-base">{notice.title}</span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">
                  {notice.created_at.slice(0, 10)}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              </span>
            </button>
            {open ? (
              <div
                className="tiptap-content pt-3 pb-4 text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: notice.content }}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
