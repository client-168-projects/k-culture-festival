"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export type DateRange = { start: Date | null; end: Date | null };

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWithinRange(date: Date, range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  return date > range.start && date < range.end;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function buildMonthGrid(month: Date): Date[] {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

type CalendarProps = {
  month: Date;
  onMonthChange: (month: Date) => void;
  selectedRange: DateRange;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  className?: string;
};

export function Calendar({
  month,
  onMonthChange,
  selectedRange,
  onSelectDate,
  minDate,
  className,
}: CalendarProps) {
  const days = buildMonthGrid(month);
  const min = minDate ? startOfDay(minDate) : null;

  return (
    <div className={cn("w-full max-w-full", className)}>
      <div className="mb-3 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9"
          aria-label="이전 달"
          onClick={() =>
            onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-base font-semibold">
          {month.getFullYear()}년 {month.getMonth() + 1}월
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9"
          aria-label="다음 달"
          onClick={() =>
            onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-sm text-muted-foreground">
            {day}
          </span>
        ))}

        {days.map((day) => {
          const inCurrentMonth = day.getMonth() === month.getMonth();
          const disabled = min ? day < min : false;
          const isStart = isSameDay(day, selectedRange.start);
          const isEnd = isSameDay(day, selectedRange.end);
          const inRange = isWithinRange(day, selectedRange);

          return (
            <div key={day.toISOString()} className="flex items-center justify-center py-0.5">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(day)}
                aria-pressed={isStart || isEnd}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full text-sm transition-colors sm:size-10",
                  !inCurrentMonth && "text-muted-foreground/40",
                  inCurrentMonth && !disabled && "text-foreground hover:bg-accent",
                  disabled && "cursor-not-allowed text-muted-foreground/30",
                  inRange && "rounded-none bg-accent",
                  (isStart || isEnd) &&
                    "bg-primary text-primary-foreground hover:bg-primary",
                )}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { isSameDay, startOfDay };
