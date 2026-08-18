"use client";

import { ExternalLink, ImageIcon, LogOut, Megaphone } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "notices", label: "공지사항", icon: Megaphone },
  { key: "notice-popups", label: "팝업 관리", icon: ImageIcon },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-border p-4">
      <div className="flex flex-col gap-4">
        <div className="px-3 pt-1">
          <p className="text-lg font-semibold">파주 K-컬처 페스티벌</p>
          <p className="text-sm text-muted-foreground">관리자 페이지</p>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`/admin/${item.key}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith(`/admin/${item.key}`) &&
                  "bg-accent text-accent-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ExternalLink className="size-4" />
          행사 페이지로 이동
        </Link>

        <Button
          variant="outline-destructive"
          size="sm"
          className="justify-start"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </div>
    </aside>
  );
}
