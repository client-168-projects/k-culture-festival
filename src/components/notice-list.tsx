"use client";

import { ChevronDown, Download, FileText } from "lucide-react";
import { useState } from "react";

import { cn, formatFileSize } from "@/lib/utils";
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
              <div className="pt-3 pb-4">
                <div
                  className="tiptap-content text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: notice.content }}
                />
                {notice.attachments.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                    {notice.attachments.map((attachment) => (
                      <li
                        key={attachment.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <FileText className="size-4 shrink-0 text-muted-foreground" />
                          <span className="truncate text-sm">
                            {attachment.file_name}
                          </span>
                          <span className="shrink-0 text-sm text-muted-foreground">
                            ({formatFileSize(attachment.file_size)})
                          </span>
                        </span>
                        <a
                          href={`${attachment.file_url}?download=${encodeURIComponent(attachment.file_name)}`}
                          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <Download className="size-4" />
                          다운로드
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
