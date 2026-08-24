"use client";

import { FileText, Paperclip, Pin, X } from "lucide-react";
import dynamic from "next/dynamic";
import { type ChangeEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field-group";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  MAX_ATTACHMENT_SIZE_BYTES,
  MAX_ATTACHMENTS_PER_NOTICE,
} from "@/constants/media";
import { uploadFile } from "@/lib/upload-client";
import { cn, formatFileSize } from "@/lib/utils";
import type { Notice } from "@/types/notice";

const RichEditor = dynamic(
  () => import("@/components/admin/rich-editor").then((mod) => mod.RichEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-72 rounded-md border border-input" aria-hidden />
    ),
  },
);

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
  const [isPinned, setIsPinned] = useState(notice?.is_pinned === 1);
  const [attachments, setAttachments] = useState<AttachmentDraft[]>(
    notice?.attachments ?? [],
  );
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [error, setError] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentProgress, setAttachmentProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(next: boolean) {
    if (next) {
      setTitle(notice?.title ?? "");
      setContent(notice?.content ?? "");
      setIsPinned(notice?.is_pinned === 1);
      setAttachments(notice?.attachments ?? []);
      setView("edit");
      setError(null);
      setAttachmentError(null);
    }
    onOpenChange(next);
  }

  async function handleAttachmentSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setAttachmentError(null);

    const remainingSlots = MAX_ATTACHMENTS_PER_NOTICE - attachments.length;
    if (remainingSlots <= 0) {
      setAttachmentError(`첨부파일은 최대 ${MAX_ATTACHMENTS_PER_NOTICE}개까지 첨부할 수 있습니다.`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setAttachmentError(
        `한 번에 최대 ${remainingSlots}개까지만 추가할 수 있어 나머지 파일은 제외했습니다.`,
      );
    }

    setUploadingAttachment(true);
    setAttachmentProgress({ completed: 0, total: filesToUpload.length });

    const results = await Promise.allSettled(
      filesToUpload.map(async (file) => {
        try {
          const result = await uploadFile<{
            name: string;
            url: string;
            size: number;
          }>("/api/admin/upload/attachment", file);

          if (!result.ok) {
            throw new Error(result.error ?? "첨부파일 업로드에 실패했습니다.");
          }

          return {
            file_name: result.data.name,
            file_url: result.data.url,
            file_size: result.data.size,
          } as AttachmentDraft;
        } finally {
          setAttachmentProgress((prev) =>
            prev ? { completed: prev.completed + 1, total: prev.total } : prev,
          );
        }
      }),
    );

    const uploaded: AttachmentDraft[] = [];
    let firstError: string | null = null;
    for (const result of results) {
      if (result.status === "fulfilled") {
        uploaded.push(result.value);
      } else if (!firstError) {
        firstError =
          result.reason instanceof Error
            ? result.reason.message
            : "첨부파일 업로드에 실패했습니다.";
      }
    }

    if (uploaded.length > 0) {
      setAttachments((prev) => [...prev, ...uploaded]);
    }
    if (firstError) {
      setAttachmentError(firstError);
    }

    setUploadingAttachment(false);
    setAttachmentProgress(null);
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

    const payload = { title, content, is_pinned: isPinned, attachments };
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
          <FieldGroup label="제목" htmlFor="notice-title">
            <Input
              id="notice-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지 제목을 입력하세요"
            />
          </FieldGroup>

          <button
            type="button"
            onClick={() => setIsPinned((prev) => !prev)}
            aria-pressed={isPinned}
            className={cn(
              "flex w-fit items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              isPinned
                ? "border-brand-vermillion bg-brand-vermillion/10 text-brand-vermillion"
                : "border-input text-muted-foreground hover:text-foreground",
            )}
          >
            <Pin className={cn("size-4", isPinned && "fill-current")} />
            상단 고정
          </button>

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

          <FieldGroup label="첨부파일">
            {attachments.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {attachments.map((attachment, index) => (
                  <li
                    key={attachment.file_url}
                    className="flex items-center justify-between gap-3 rounded-md bg-muted px-2.5 py-1 text-xs"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{attachment.file_name}</span>
                      <span className="shrink-0 text-muted-foreground">
                        ({formatFileSize(attachment.file_size)})
                      </span>
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0"
                      aria-label="첨부파일 삭제"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <X className="size-3.5" />
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
                multiple
                accept={ALLOWED_ATTACHMENT_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
                className="hidden"
                onChange={handleAttachmentSelected}
              />
            </div>
            {attachmentProgress ? (
              <div className="flex items-center gap-2">
                <Progress
                  value={(attachmentProgress.completed / attachmentProgress.total) * 100}
                  className="flex-1"
                />
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {attachmentProgress.completed}/{attachmentProgress.total}
                </span>
              </div>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")} 파일, 개당{" "}
              {formatFileSize(MAX_ATTACHMENT_SIZE_BYTES)}까지, 최대{" "}
              {MAX_ATTACHMENTS_PER_NOTICE}개
            </p>
            {attachmentError ? (
              <p className="text-sm text-destructive">{attachmentError}</p>
            ) : null}
          </FieldGroup>
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
