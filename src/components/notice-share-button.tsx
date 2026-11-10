"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function NoticeShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // 사용자가 공유를 취소한 경우
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="size-4" />
          링크 복사됨
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          공유하기
        </>
      )}
    </Button>
  );
}
