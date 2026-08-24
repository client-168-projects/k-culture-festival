"use client";

import { Eye, ImagePlus, Trash2 } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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
  HIDE_DURATION_OPTIONS,
  POPUP_IMAGE_MAX_DIMENSION,
  POPUP_SIZE_OPTIONS,
} from "@/constants/notice-popup";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/constants/media";
import { NoticePopupPreviewOverlay } from "@/features/notice-popup/components/notice-popup-preview-overlay";
import {
  resizeImageIfNeeded,
  trimTransparentPadding,
} from "@/lib/image-resize";
import { validateImageFile } from "@/lib/media-validation";
import { validateNoticePopupInput } from "@/lib/notice-popup-validation";
import { uploadFile } from "@/lib/upload-client";
import { formatFileSize } from "@/lib/utils";
import type { NoticePopup, PopupSize } from "@/types/notice-popup";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  popup?: NoticePopup;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  onDeleted: () => void;
};

export function NoticePopupDialog({
  open,
  mode,
  popup,
  onOpenChange,
  onSaved,
  onDeleted,
}: Props) {
  const [imageUrl, setImageUrl] = useState(popup?.image_url ?? "");
  const [targetUrl, setTargetUrl] = useState(popup?.target_url ?? "");
  const [hideDurationDays, setHideDurationDays] = useState(
    popup?.hide_duration_days ?? 7,
  );
  const [startDate, setStartDate] = useState(popup?.start_date ?? "");
  const [endDate, setEndDate] = useState(popup?.end_date ?? "");
  const [isHidden, setIsHidden] = useState(Boolean(popup?.is_hidden));
  const [size, setSize] = useState<PopupSize>(popup?.size ?? "medium");
  const [uploadStep, setUploadStep] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(next: boolean) {
    if (next) {
      setImageUrl(popup?.image_url ?? "");
      setTargetUrl(popup?.target_url ?? "");
      setHideDurationDays(popup?.hide_duration_days ?? 7);
      setStartDate(popup?.start_date ?? "");
      setEndDate(popup?.end_date ?? "");
      setIsHidden(Boolean(popup?.is_hidden));
      setSize(popup?.size ?? "medium");
      setError(null);
      setUploadStep(null);
      setPreviewOpen(false);
      setDeleteConfirmOpen(false);
    }
    onOpenChange(next);
  }

  async function handleDelete() {
    if (!popup) return;
    setDeleting(true);
    await fetch(`/api/admin/notice-popups/${popup.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteConfirmOpen(false);
    onDeleted();
  }

  async function handleImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadStep({ label: "여백 제거 중...", value: 20 });
    const trimmed = await trimTransparentPadding(file);

    setUploadStep({ label: "이미지 처리 중...", value: 50 });
    const resized = await resizeImageIfNeeded(
      trimmed,
      POPUP_IMAGE_MAX_DIMENSION,
    );

    setUploadStep({ label: "업로드 중...", value: 80 });
    const result = await uploadFile<{ url: string }>(
      "/api/admin/upload/image",
      resized,
    );

    if (!result.ok) {
      setUploadStep(null);
      setError(result.error ?? "이미지 업로드에 실패했습니다.");
      return;
    }

    setUploadStep({ label: "완료", value: 100 });
    setImageUrl(result.data.url);
    setTimeout(() => setUploadStep(null), 300);
  }

  async function handleSave() {
    const validationError = validateNoticePopupInput({
      imageUrl,
      targetUrl,
      hideDurationDays,
      startDate,
      endDate,
      size,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      imageUrl,
      targetUrl,
      hideDurationDays,
      startDate,
      endDate,
      isHidden,
      size,
    };
    const res =
      mode === "create"
        ? await fetch("/api/admin/notice-popups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/notice-popups/${popup!.id}`, {
            method: "PATCH",
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
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "팝업 등록" : "팝업 수정"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <FieldGroup label="이미지">
              {imageUrl ? (
                // Supabase 공개 URL 이미지 — next.config에 remotePatterns가 없어 next/image 대신
                // 프로젝트 전반의 관례(공지 첨부/본문 이미지)와 동일하게 일반 img 태그를 사용한다.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="팝업 이미지 미리보기"
                  className="max-h-72 w-full rounded-md border border-input bg-muted object-contain"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded-md border border-dashed border-input text-sm text-muted-foreground">
                  업로드된 이미지가 없습니다
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadStep !== null}
                >
                  <ImagePlus className="size-4" />
                  {imageUrl ? "이미지 교체" : "이미지 업로드"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewOpen(true)}
                  disabled={!imageUrl}
                >
                  <Eye className="size-4" />
                  미리보기
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
                  className="hidden"
                  onChange={handleImageSelected}
                />
              </div>
              {uploadStep ? (
                <div className="flex items-center gap-2">
                  <Progress value={uploadStep.value} className="flex-1" />
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {uploadStep.label}
                  </span>
                </div>
              ) : null}
              <p className="text-sm text-muted-foreground">
                {formatFileSize(MAX_IMAGE_SIZE_BYTES)}까지, 가장자리 투명 여백은
                자동으로 잘려나가고 가로/세로 {POPUP_IMAGE_MAX_DIMENSION}
                px 초과 시 자동으로 축소되어 업로드됩니다.
              </p>
            </FieldGroup>

            <FieldGroup label="팝업 크기 (너비 기준, 높이는 이미지 비율에 따라 자동)">
              <div className="flex flex-wrap gap-2">
                {POPUP_SIZE_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={size === option.value ? "default" : "outline"}
                    onClick={() => setSize(option.value)}
                  >
                    {option.label} ({option.widthPx}px)
                  </Button>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="이동 URL (선택)" htmlFor="popup-target-url">
              <Input
                id="popup-target-url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
              />
              <p className="text-sm text-muted-foreground">
                http:// 또는 https://를 포함한 전체 주소를 입력해주세요.
              </p>
            </FieldGroup>

            <FieldGroup label="게시 기간">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={(range) => {
                  setStartDate(range.startDate);
                  setEndDate(range.endDate);
                }}
              />
            </FieldGroup>

            <FieldGroup label="N일간 보지 않기 기간">
              <div className="flex flex-wrap gap-2">
                {HIDE_DURATION_OPTIONS.map((days) => (
                  <Button
                    key={days}
                    type="button"
                    size="sm"
                    variant={hideDurationDays === days ? "default" : "outline"}
                    onClick={() => setHideDurationDays(days)}
                  >
                    {days}일
                  </Button>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="게시 상태">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={!isHidden ? "default" : "outline"}
                  onClick={() => setIsHidden(false)}
                >
                  게시
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={isHidden ? "destructive" : "outline"}
                  onClick={() => setIsHidden(true)}
                >
                  숨김
                </Button>
              </div>
            </FieldGroup>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            {mode === "edit" ? (
              <Button
                type="button"
                variant="outline-destructive"
                className="sm:mr-auto"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash2 className="size-4" />
                삭제
              </Button>
            ) : null}
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={saving || uploadStep !== null}
            >
              {saving ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="공지 팝업 삭제"
        description="공지 팝업을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다."
        onConfirm={handleDelete}
        pending={deleting}
      />

      <NoticePopupPreviewOverlay
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        popup={{
          id: popup?.id ?? -1,
          image_url: imageUrl,
          target_url: targetUrl || null,
          hide_duration_days: hideDurationDays,
          start_date: startDate,
          end_date: endDate,
          priority: popup?.priority ?? 0,
          is_hidden: isHidden ? 1 : 0,
          size,
          created_at: popup?.created_at ?? "",
          updated_at: popup?.updated_at ?? "",
        }}
      />
    </>
  );
}
