"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { NavSection } from "@/config/nav";
import { cn } from "@/lib/utils";

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
  const [scrolled, setScrolled] = useState(false);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between gap-2 border-b px-5 shadow-sm transition-all duration-300 sm:h-24 sm:gap-4 sm:px-10 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:justify-normal lg:px-16",
        scrolled
          ? "border-border bg-background/90 shadow-md backdrop-blur-lg"
          : "border-border/60 bg-background/80 backdrop-blur-md",
      )}
      onMouseLeave={() => {
        setMegaOpen(false);
        setActiveKey(null);
      }}
    >
      <Link href="/" className="block min-w-0 shrink-0">
        <Image
          src="/assets/logo/kculture-festival-logo.png"
          alt={title}
          width={392}
          height={307}
          priority
          className="h-16 w-auto sm:h-20"
        />
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
              "group relative rounded-md px-4 py-2.5 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground",
              megaOpen && activeKey === section.key && "text-foreground",
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
            <span
              className={cn(
                "absolute inset-x-4 bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-primary transition-transform duration-200 group-hover:scale-x-100",
                megaOpen && activeKey === section.key && "scale-x-100",
              )}
            />
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
