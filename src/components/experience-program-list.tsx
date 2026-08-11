"use client";

import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import { useMemo, useState } from "react";

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
import type { ExperienceProgram } from "@/data/experience-programs";
import { cn, toAbsoluteUrl } from "@/lib/utils";

type SortOrder = "none" | "asc" | "desc";

const SORT_LABELS: Record<SortOrder, string> = {
  none: "기본순",
  asc: "진행 회차 적은순",
  desc: "진행 회차 많은순",
};

function parseSessionCount(sessions: string): number | null {
  // "총 N회" 형태만 실제 회차 수로 인정한다 — "상시 운영 (선착순 100통)"처럼
  // 다른 숫자가 문자열 어딘가에 섞여 있는 경우까지 잘못 집어내지 않기 위함.
  const match = sessions.match(/^총\s*(\d+)회/);
  return match ? Number(match[1]) : null;
}

export function ExperienceProgramList({
  programs,
}: {
  programs: ExperienceProgram[];
}) {
  const [search, setSearch] = useState("");
  const [alwaysOnlyOn, setAlwaysOnlyOn] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const visiblePrograms = useMemo(() => {
    let result = programs;

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(keyword));
    }

    if (alwaysOnlyOn) {
      result = result.filter((p) => p.sessions.startsWith("상시"));
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
  }, [programs, search, alwaysOnlyOn, sortOrder]);

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
            variant={alwaysOnlyOn ? "default" : "outline"}
            size="sm"
            onClick={() => setAlwaysOnlyOn((prev) => !prev)}
          >
            상시 운영만 보기
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
              className="gap-2 py-5"
            >
              <CardHeader className="px-4 sm:px-5">
                <CardTitle className="line-clamp-2 font-heading text-lg font-bold text-brand-cobalt">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between gap-3 px-4 sm:px-5">
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>참여 인원 {item.capacity}</span>
                  <span>진행 회차 {item.sessions}</span>
                </div>
                {item.applicationUrl ? (
                  <Button asChild size="sm" className="h-12 shrink-0 rounded-sm bg-brand-cobalt hover:bg-brand-cobalt-deep">
                    <a href={toAbsoluteUrl(item.applicationUrl)} target="_blank" rel="noreferrer">
                      사전신청하러 가기
                    </a>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
