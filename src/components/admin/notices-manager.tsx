"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { NoticeDialog } from "@/components/admin/notice-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
        <h1 className="text-2xl font-semibold tracking-tight">공지사항</h1>
        <Button onClick={() => setDialogState({ mode: "create" })}>
          <Plus className="size-4" />
          새 공지 작성
        </Button>
      </div>

      <Card>
        <CardContent>
          {notices.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              등록된 공지사항이 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {notices.map((notice) => (
                <li
                  key={notice.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => setDialogState({ mode: "edit", notice })}
                    className="flex-1 truncate text-left text-base hover:underline"
                  >
                    {notice.title}
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

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>공지사항 삭제</DialogTitle>
            <DialogDescription>
              &apos;{deleteTarget?.title}&apos; 공지사항을 삭제하시겠습니까?
              되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
