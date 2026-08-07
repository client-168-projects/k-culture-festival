"use client";

import { LogOut, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [{ key: "notices", label: "공지사항", icon: Megaphone }];

export function AdminSidebar({ active }: { active: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-border p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.key}
            href={`/admin/${item.key}`}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              active === item.key && "bg-accent text-accent-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </a>
        ))}
      </nav>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        <LogOut className="size-4" />
        로그아웃
      </Button>
    </aside>
  );
}
