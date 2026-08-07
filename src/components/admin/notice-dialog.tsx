"use client";

import { FileText, Paperclip, X } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

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
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  MAX_ATTACHMENT_SIZE_BYTES,
  MAX_ATTACHMENTS_PER_NOTICE,
} from "@/constants/media";
import { cn, formatFileSize } from "@/lib/utils";
import type { Notice } from "@/types/notice";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  notice?: Notice;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

type AttachmentDraft = { file_name: string; file_url: string; file_size: number };

export function NoticeDialog({
  open,
  mode,
  notice,
  onOpenChange,
  onSaved,
}: Props) {
  const [title, setTitle] = useState(notice?.title ?? "");
  const [content, setContent] = useState(notice?.content ?? "");
  const [attachments, setAttachments] = useState<AttachmentDraft[]>(
    notice?.attachments ?? [],
  );
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [error, setError] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [saving, setSaving] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(next: boolean) {
    if (next) {
      setTitle(notice?.title ?? "");
      setContent(notice?.content ?? "");
      setAttachments(notice?.attachments ?? []);
      setView("edit");
      setError(null);
      setAttachmentError(null);
    }
    onOpenChange(next);
  }

  async function handleAttachmentSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setAttachmentError(null);

    if (attachments.length >= MAX_ATTACHMENTS_PER_NOTICE) {
      setAttachmentError(`첨부파일은 최대 ${MAX_ATTACHMENTS_PER_NOTICE}개까지 첨부할 수 있습니다.`);
      return;
    }

    setUploadingAttachment(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload/attachment", {
      method: "POST",
      body: formData,
    });
    const body = await res.json().catch(() => null);
    setUploadingAttachment(false);

    if (!res.ok) {
      setAttachmentError(body?.error ?? "첨부파일 업로드에 실패했습니다.");
      return;
    }

    setAttachments((prev) => [
      ...prev,
      { file_name: body.name, file_url: body.url, file_size: body.size },
    ]);
  }

  async function handleRemoveAttachment(index: number) {
    const target = attachments[index];
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    await fetch("/api/admin/upload/attachment", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: target.file_url }),
    }).catch(() => null);
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = { title, content, attachments };
    const res =
      mode === "create"
        ? await fetch("/api/admin/notices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/notices/${notice!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
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

          <div className="flex flex-col gap-1.5">
            <Label>첨부파일</Label>
            {attachments.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {attachments.map((attachment, index) => (
                  <li
                    key={attachment.file_url}
                    className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{attachment.file_name}</span>
                      <span className="shrink-0 text-muted-foreground">
                        ({formatFileSize(attachment.file_size)})
                      </span>
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0"
                      aria-label="첨부파일 삭제"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}

            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => attachmentInputRef.current?.click()}
                disabled={
                  uploadingAttachment || attachments.length >= MAX_ATTACHMENTS_PER_NOTICE
                }
              >
                <Paperclip className="size-4" />
                {uploadingAttachment
                  ? "업로드 중..."
                  : `첨부파일 추가 (${attachments.length}/${MAX_ATTACHMENTS_PER_NOTICE})`}
              </Button>
              <input
                ref={attachmentInputRef}
                type="file"
                accept={ALLOWED_ATTACHMENT_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
                className="hidden"
                onChange={handleAttachmentSelected}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")} 파일, 개당{" "}
              {MAX_ATTACHMENT_SIZE_BYTES / 1024 / 1024}MB까지, 최대{" "}
              {MAX_ATTACHMENTS_PER_NOTICE}개
            </p>
            {attachmentError ? (
              <p className="text-sm text-destructive">{attachmentError}</p>
            ) : null}
          </div>
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
