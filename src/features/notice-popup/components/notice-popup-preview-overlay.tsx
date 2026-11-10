"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { NoticePopupCard } from "@/features/notice-popup/components/notice-popup-card";
import { cn } from "@/lib/utils";
import type { NoticePopup } from "@/types/notice-popup";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  popup: NoticePopup;
};

/**
 * 공개 사이트와 같은 NoticePopupCard로 팝업을 미리 보여준다.
 * 중첩 Dialog로 구현해 미리보기 조작 시 바깥 편집 다이얼로그가 닫히지 않도록 한다.
 */
export function NoticePopupPreviewOverlay({
  open,
  onOpenChange,
  popup,
}: Props) {
  return (
    // modal={false}로 바꾸면 미리보기 클릭 시 바깥 다이얼로그까지 닫히므로 기본값을 유지한다.
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "inset-x-4 bottom-4 top-auto right-auto left-auto w-auto max-w-full translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-transparent p-0 shadow-none",
          "sm:inset-x-auto sm:right-6 sm:bottom-6",
          "lg:right-8 lg:bottom-8",
        )}
      >
        <DialogTitle className="sr-only">공지 팝업 미리보기</DialogTitle>
        <NoticePopupCard
          popup={popup}
          onClose={() => onOpenChange(false)}
          interactive={false}
        />
      </DialogContent>
    </Dialog>
  );
}
