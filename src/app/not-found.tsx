import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="size-6 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="max-w-sm text-muted-foreground">
        요청하신 페이지가 삭제되었거나 주소가 잘못되었습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 이동</Link>
      </Button>
    </main>
  );
}
