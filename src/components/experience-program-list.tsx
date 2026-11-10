"use client";

import { ArrowDownAZ, ArrowRight, ArrowUpAZ, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { EXPERIENCE_CATEGORY_STYLE } from "@/constants/experience-category";
import type { ExperienceProgram } from "@/data/experience-programs";
import { cn, formatKstOpensAt, toAbsoluteUrl } from "@/lib/utils";

type SortOrder = "none" | "asc" | "desc";

const SORT_LABELS: Record<SortOrder, string> = {
  none: "기본순",
  asc: "진행 회차 적은순",
  desc: "진행 회차 많은순",
};

function parseSessionCount(sessions: string): number | null {
  // "총 N회"로 시작하는 경우만 회차 수로 인정한다.
  const match = sessions.match(/^총\s*(\d+)회/);
  return match ? Number(match[1]) : null;
}

function ApplicationSection({
  capacity,
  sessions,
  applicationUrl,
  applicationOpensAt,
  applicationClosed,
}: {
  capacity: string;
  sessions: string;
  applicationUrl?: string;
  applicationOpensAt?: string;
  applicationClosed?: boolean;
}) {
  // 정적 페이지이므로 hydration 불일치를 피하기 위해 닫힘 상태로 시작해 마운트 후 보정한다.
  const [isOpen, setIsOpen] = useState(!applicationOpensAt);

  useEffect(() => {
    if (applicationClosed) return;
    if (!applicationOpensAt) return;
    const target = new Date(applicationOpensAt).getTime();
    const check = () => setIsOpen(Date.now() >= target);
    check();
    const delay = target - Date.now();
    if (delay > 0) {
      const timer = setTimeout(check, delay);
      return () => clearTimeout(timer);
    }
  }, [applicationOpensAt, applicationClosed]);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span>참여 인원 {capacity}</span>
          <span>진행 회차 {sessions}</span>
        </div>
        <div className="flex min-h-9 shrink-0 items-center">
          {applicationUrl ? (
            applicationClosed ? (
              <Button disabled size="sm" className="shrink-0 rounded-sm">
                사전신청 마감
              </Button>
            ) : isOpen ? (
              <Button
                asChild
                size="sm"
                className="shrink-0 rounded-sm bg-brand-cobalt hover:bg-brand-cobalt-deep"
              >
                <a
                  href={toAbsoluteUrl(applicationUrl)}
                  target="_blank"
                  rel="noreferrer"
                >
                  사전신청 바로가기
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            ) : (
              <Button disabled size="sm" className="shrink-0 rounded-sm">
                사전신청 바로가기
                <ArrowRight className="size-4" />
              </Button>
            )
          ) : null}
        </div>
      </div>
      {applicationUrl && !applicationClosed && !isOpen && applicationOpensAt ? (
        <p className="text-right text-xs text-muted-foreground">
          *{formatKstOpensAt(applicationOpensAt)} 사전 신청 오픈
        </p>
      ) : null}
    </>
  );
}

export function ExperienceProgramList({
  programs,
}: {
  programs: ExperienceProgram[];
}) {
  const [search, setSearch] = useState("");
  const [applicationOnly, setApplicationOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const visiblePrograms = useMemo(() => {
    let result = programs;

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(keyword));
    }

    if (applicationOnly) {
      result = result.filter((p) => !!p.applicationUrl);
    }

    if (sortOrder !== "none") {
      result = [...result].sort((a, b) => {
        const aCount = parseSessionCount(a.sessions);
        const bCount = parseSessionCount(b.sessions);
        if (aCount === null && bCount === null) return 0;
        if (aCount === null) return 1;
        if (bCount === null) return -1;
        return sortOrder === "asc" ? aCount - bCount : bCount - aCount;
      });
    }

    return result;
  }, [programs, search, applicationOnly, sortOrder]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="프로그램 이름 검색"
              className="pl-9"
            />
          </div>
          <span className="shrink-0 text-sm text-muted-foreground">
            전체 {visiblePrograms.length}개
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={applicationOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setApplicationOnly((prev) => !prev)}
          >
            사전신청 프로그램만 보기
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                {sortOrder === "asc" ? (
                  <ArrowUpAZ className="size-4" />
                ) : (
                  <ArrowDownAZ className="size-4" />
                )}
                {SORT_LABELS[sortOrder]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(SORT_LABELS) as SortOrder[]).map((order) => (
                <DropdownMenuItem
                  key={order}
                  className={cn(sortOrder === order && "bg-accent text-accent-foreground")}
                  onSelect={() => setSortOrder(order)}
                >
                  {SORT_LABELS[order]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {visiblePrograms.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          조건에 맞는 체험 프로그램이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePrograms.map((item) => (
            <Card
              key={item.title}
              variant="accent"
              className="flex h-full flex-col gap-2 py-5"
            >
              <CardHeader className="gap-2 px-4 sm:px-5">
                {item.category ? (
                  <span
                    className={cn(
                      "inline-block w-fit rounded-full px-2.5 py-1 text-xs font-bold",
                      EXPERIENCE_CATEGORY_STYLE[item.category] ??
                        "bg-brand-paper text-brand-ink",
                    )}
                  >
                    {item.category}
                  </span>
                ) : null}
                <CardTitle className="line-clamp-2 min-h-14 font-heading text-lg leading-snug font-bold text-brand-cobalt">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end gap-2 px-4 sm:px-5">
                <ApplicationSection
                  capacity={item.capacity}
                  sessions={item.sessions}
                  applicationUrl={item.applicationUrl}
                  applicationOpensAt={item.applicationOpensAt}
                  applicationClosed={item.applicationClosed}
                />
                {item.note ? (
                  <p className="text-right text-xs text-muted-foreground">
                    *{item.note}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
