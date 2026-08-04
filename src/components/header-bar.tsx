"use client";

import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type NavItem = {
  key: string;
  title: string;
  href: string;
};

export type NavSection = {
  key: string;
  title: string;
  items: NavItem[];
};

export function HeaderBar({
  title,
  sections,
  menuLabel,
  children,
}: {
  title: string;
  sections: NavSection[];
  menuLabel: string;
  children: ReactNode;
}) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [columnOffsets, setColumnOffsets] = useState<number[]>([]);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useLayoutEffect(() => {
    if (!megaOpen) return;

    const measure = () =>
      setColumnOffsets(
        buttonRefs.current.map((el) =>
          el ? el.offsetLeft + el.offsetWidth / 2 : 0,
        ),
      );

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [megaOpen]);

  return (
    <header
      className="relative flex items-center justify-between gap-2 border-b border-border px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:justify-normal"
      onMouseLeave={() => {
        setMegaOpen(false);
        setActiveKey(null);
      }}
    >
      <Link
        href="/"
        className="block min-w-0 truncate text-base font-semibold sm:text-lg"
      >
        {title}
      </Link>

      <nav className="hidden items-center gap-8 justify-self-center md:flex">
        {sections.map((section, index) => (
          <button
            key={section.key}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            className={cn(
              "rounded-md px-4 py-2.5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              megaOpen &&
                activeKey === section.key &&
                "bg-accent text-accent-foreground",
            )}
            onMouseEnter={() => {
              setActiveKey(section.key);
              setMegaOpen(true);
            }}
            onFocus={() => {
              setActiveKey(section.key);
              setMegaOpen(true);
            }}
            onClick={() => {
              setActiveKey(section.key);
              setMegaOpen((prev) => !(prev && activeKey === section.key));
            }}
          >
            {section.title}
          </button>
        ))}
      </nav>

      <div className="flex items-center justify-self-end gap-1">
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={menuLabel}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      {megaOpen ? (
        <div className="animate-drop-down absolute inset-x-0 top-full z-40 hidden h-40 border-b border-border bg-popover shadow-md md:block">
          {sections.map((section, index) => (
            <div
              key={section.key}
              className="absolute top-4 flex -translate-x-1/2 flex-col items-center gap-3 px-4"
              style={{ left: columnOffsets[index] ?? 0 }}
            >
              {section.items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-base whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMegaOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="animate-drop-down absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-background px-4 py-4 sm:px-6 md:hidden">
          <div className="flex flex-col gap-6">
            {sections.map((section) => (
              <div key={section.key} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {section.title}
                </span>
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="rounded-md px-2 py-2 text-base hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
