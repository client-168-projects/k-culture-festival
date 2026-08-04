import Link from "next/link";

import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-4 text-center text-foreground antialiased sm:px-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground">
          페이지를 찾을 수 없습니다.{" "}
          <Link href="/" className="underline underline-offset-4">
            홈으로 이동
          </Link>
        </p>
      </body>
    </html>
  );
}
