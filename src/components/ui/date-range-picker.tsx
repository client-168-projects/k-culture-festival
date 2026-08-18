"use client";

import { useState } from "react";

import { Calendar, startOfDay, type DateRange } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

function parseDateString(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatShort(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

type DateRangePickerProps = {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
  minDate?: Date;
  className?: string;
};

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  className,
}: DateRangePickerProps) {
  const start = parseDateString(startDate);
  const end = parseDateString(endDate);
  const [month, setMonth] = useState(() => start ?? new Date());

  const range: DateRange = { start, end };

  function handleSelectDate(date: Date) {
    const day = startOfDay(date);

    if (!range.start || (range.start && range.end)) {
      onChange({ startDate: toDateString(day), endDate: "" });
      return;
    }

    if (day < range.start) {
      onChange({ startDate: toDateString(day), endDate: "" });
      return;
    }

    onChange({ startDate: toDateString(range.start), endDate: toDateString(day) });
  }

  return (
    <div className={cn("flex flex-col gap-3 rounded-md border border-input p-3 sm:p-4", className)}>
      <Calendar
        month={month}
        onMonthChange={setMonth}
        selectedRange={range}
        onSelectDate={handleSelectDate}
        minDate={minDate}
      />
      <div className="flex items-center justify-center gap-2 border-t border-border pt-3 text-base font-medium">
        <span className={cn(!start && "text-muted-foreground")}>
          {start ? formatShort(start) : "시작일"}
        </span>
        <span className="text-muted-foreground">—</span>
        <span className={cn(!end && "text-muted-foreground")}>
          {end ? formatShort(end) : "종료일"}
        </span>
      </div>
    </div>
  );
}
