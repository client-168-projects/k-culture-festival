"use client";

import { useState } from "react";

import { RichEditor } from "@/components/admin/rich-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Notice } from "@/types/notice";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  notice?: Notice;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export function NoticeDialog({
  open,
  mode,
  notice,
  onOpenChange,
  onSaved,
}: Props) {
  const [title, setTitle] = useState(notice?.title ?? "");
  const [content, setContent] = useState(notice?.content ?? "");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleOpenChange(next: boolean) {
    if (next) {
      setTitle(notice?.title ?? "");
      setContent(notice?.content ?? "");
      setView("edit");
      setError(null);
    }
    onOpenChange(next);
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setSaving(true);
    setError(null);

    const res =
      mode === "create"
        ? await fetch("/api/admin/notices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
          })
        : await fetch(`/api/admin/notices/${notice!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
          });

    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "저장에 실패했습니다.");
      return;
    }

    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "공지사항 작성" : "공지사항 수정"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notice-title">제목</Label>
            <Input
              id="notice-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지 제목을 입력하세요"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1 self-start rounded-md bg-muted p-1">
              <button
                type="button"
                onClick={() => setView("edit")}
                className={cn(
                  "rounded-sm px-3 py-1 text-sm font-medium transition-colors",
                  view === "edit"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                편집
              </button>
              <button
                type="button"
                onClick={() => setView("preview")}
                className={cn(
                  "rounded-sm px-3 py-1 text-sm font-medium transition-colors",
                  view === "preview"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                미리보기
              </button>
            </div>

            {view === "edit" ? (
              <RichEditor
                value={content}
                onChange={setContent}
                placeholder="공지 내용을 입력하세요"
              />
            ) : (
              <div className="min-h-72 rounded-md border border-input p-4">
                <h2 className="mb-3 text-lg font-semibold">
                  {title || "(제목 없음)"}
                </h2>
                <div
                  className="tiptap-content"
                  dangerouslySetInnerHTML={{
                    __html: content || "<p>(내용 없음)</p>",
                  }}
                />
              </div>
            )}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
