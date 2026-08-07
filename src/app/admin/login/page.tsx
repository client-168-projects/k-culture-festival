import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "관리자 로그인",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 px-4">
      <h1 className="text-xl font-bold">K-Culture Festival 관리자</h1>
      <LoginForm />
    </div>
  );
}
