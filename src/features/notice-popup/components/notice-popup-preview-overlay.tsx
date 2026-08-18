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
 * 실제 공개 사이트와 동일한 컴포넌트(NoticePopupCard)를 재사용해 위치/크기를 그대로
 * 미리 보여준다. 별도 fixed div가 아니라 중첩된 Radix Dialog로 구현한 이유: Radix의
 * 레이어 스택이 "안쪽 다이얼로그와의 상호작용은 바깥 다이얼로그를 닫지 않는다"를
 * 기본 지원하므로, 바깥(생성/수정) 다이얼로그가 함께 닫히는 문제를 직접 막을 필요가 없다.
 */
export function NoticePopupPreviewOverlay({
  open,
  onOpenChange,
  popup,
}: Props) {
  return (
    // modal(기본값 true) 유지: false로 두면 Radix의 레이어 스택 우선순위 계산에서
    // 빠져서, 미리보기 안을 클릭해도 바깥(생성/수정) 다이얼로그의 바깥-클릭 감지가
    // 함께 반응해 둘 다 닫혀버렸다. 스크롤 잠금 중복으로 스크롤바가 잠깐 보이는 것보다
    // 다이얼로그가 잘못 닫히는 쪽이 훨씬 나쁜 버그라 정확한 레이어 스택 동작을 우선한다.
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
