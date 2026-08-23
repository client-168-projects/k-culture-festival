"use client";

import { ArrowDown, ArrowUp, ExternalLink, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NoticePopupDialog } from "@/components/admin/notice-popup-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPopupStatus } from "@/lib/notice-popup-validation";
import type { NoticePopup, PopupStatus } from "@/types/notice-popup";

type DialogState =
  { mode: "create" } | { mode: "edit"; popup: NoticePopup } | null;

const STATUS_LABEL: Record<PopupStatus, string> = {
  scheduled: "게시 예정",
  active: "게시 중",
  ended: "게시 종료",
  hidden: "숨김",
};

const STATUS_VARIANT: Record<
  PopupStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  scheduled: "outline",
  active: "default",
  ended: "secondary",
  hidden: "destructive",
};

export function NoticePopupsManager({ popups }: { popups: NoticePopup[] }) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [reorderingId, setReorderingId] = useState<number | null>(null);

  function handleSaved() {
    setDialogState(null);
    router.refresh();
  }

  function handleDeleted() {
    setDialogState(null);
    router.refresh();
  }

  async function handleReorder(id: number, direction: "up" | "down") {
    setReorderingId(id);
    await fetch(`/api/admin/notice-popups/${id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    setReorderingId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <AdminPageHeader>팝업 관리</AdminPageHeader>
        <Button onClick={() => setDialogState({ mode: "create" })}>
          <Plus className="size-4" />새 팝업 등록
        </Button>
      </div>

      <Card>
        <CardContent>
          {popups.length === 0 ? (
            <EmptyState message="등록된 팝업이 없습니다." />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {popups.map((popup, index) => {
                const status = getPopupStatus(popup);

                return (
                  <li
                    key={popup.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDialogState({ mode: "edit", popup })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDialogState({ mode: "edit", popup });
                      }
                    }}
                    className="flex cursor-pointer flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={popup.image_url}
                      alt=""
                      className="h-16 w-24 shrink-0 rounded-md border border-border object-cover"
                    />

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={STATUS_VARIANT[status]}>
                          {STATUS_LABEL[status]}
                        </Badge>
                        <span className="font-mono text-sm text-muted-foreground">
                          {popup.start_date} ~ {popup.end_date}
                        </span>
                      </div>
                      {popup.target_url ? (
                        <span className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                          <ExternalLink className="size-3 shrink-0" />
                          <span className="truncate">{popup.target_url}</span>
                        </span>
                      ) : null}
                    </div>

                    <div
                      className="flex shrink-0 items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="위로 이동"
                        disabled={index === 0 || reorderingId !== null}
                        onClick={() => handleReorder(popup.id, "up")}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="아래로 이동"
                        disabled={
                          index === popups.length - 1 || reorderingId !== null
                        }
                        onClick={() => handleReorder(popup.id, "down")}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {dialogState ? (
        <NoticePopupDialog
          open
          mode={dialogState.mode}
          popup={dialogState.mode === "edit" ? dialogState.popup : undefined}
          onOpenChange={(open) => {
            if (!open) setDialogState(null);
          }}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      ) : null}
    </div>
  );
}
