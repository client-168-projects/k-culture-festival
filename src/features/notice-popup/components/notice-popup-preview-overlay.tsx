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

// 공개 사이트와 같은 NoticePopupCard로 미리보기를 보여준다.
// 중첩 Dialog로 만들어 미리보기를 눌러도 바깥 다이얼로그가 닫히지 않게 했다.
export function NoticePopupPreviewOverlay({
  open,
  onOpenChange,
  popup,
}: Props) {
  return (
    // modal을 false로 두면 미리보기 클릭 시 바깥 다이얼로그까지 닫힌다.
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
