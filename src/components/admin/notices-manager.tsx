"use client";

import { Pin, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { NoticeDialog } from "@/components/admin/notice-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { Notice } from "@/types/notice";

type DialogState = { mode: "create" } | { mode: "edit"; notice: Notice } | null;

export function NoticesManager({ notices }: { notices: Notice[] }) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState(false);

  function handleSaved() {
    setDialogState(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/notices/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <AdminPageHeader>공지사항</AdminPageHeader>
        <Button onClick={() => setDialogState({ mode: "create" })}>
          <Plus className="size-4" />
          새 공지 작성
        </Button>
      </div>

      <Card>
        <CardContent>
          {notices.length === 0 ? (
            <EmptyState message="등록된 공지사항이 없습니다." />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {notices.map((notice) => (
                <li
                  key={notice.id}
                  className={cn(
                    "flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0",
                    notice.is_pinned === 1 && "bg-brand-vermillion/10 px-3",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setDialogState({ mode: "edit", notice })}
                    className={cn(
                      "flex flex-1 items-center gap-1.5 truncate text-left text-base hover:underline",
                      notice.is_pinned === 1 &&
                        "font-bold text-brand-vermillion",
                    )}
                  >
                    {notice.is_pinned === 1 ? (
                      <Pin className="size-3.5 shrink-0 fill-current" />
                    ) : null}
                    <span className="truncate">{notice.title}</span>
                  </button>
                  <span className="shrink-0 font-mono text-sm text-muted-foreground">
                    {notice.created_at.slice(0, 10)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="삭제"
                    onClick={() => setDeleteTarget(notice)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {dialogState ? (
        <NoticeDialog
          open
          mode={dialogState.mode}
          notice={dialogState.mode === "edit" ? dialogState.notice : undefined}
          onOpenChange={(open) => {
            if (!open) setDialogState(null);
          }}
          onSaved={handleSaved}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="공지사항 삭제"
        description={
          <>
            &apos;{deleteTarget?.title}&apos; 공지사항을 삭제하시겠습니까?
            되돌릴 수 없습니다.
          </>
        }
        onConfirm={handleDelete}
        pending={deleting}
      />
    </div>
  );
}
