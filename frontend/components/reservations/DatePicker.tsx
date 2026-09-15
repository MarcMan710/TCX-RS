"use client";

import React, { useTransition } from "react";
import { Calendar as CalendarIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
  isLoading?: boolean;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
  isLoading = false,
}: DatePickerProps) {
  const [isPending, startTransition] = useTransition();

  // Today's date in local YYYY-MM-DD format for min boundary
  const today = new Date().toISOString().split("T")[0];

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value || value < today) return;

    startTransition(() => {
      onDateChange(value);
    });
  };

  const shiftDate = (days: number) => {
    const current = new Date(selectedDate || today);
    current.setDate(current.getDate() + days);
    const nextFormatted = current.toISOString().split("T")[0];

    if (nextFormatted >= today) {
      startTransition(() => {
        onDateChange(nextFormatted);
      });
    }
  };

  const formattedDisplay = new Date(selectedDate + "T00:00:00").toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <CalendarIcon className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium block">Selected Date</span>
          <span className="text-sm font-bold text-white">{formattedDisplay}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={() => shiftDate(-1)}
          disabled={selectedDate <= today || isLoading || isPending}
          className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="relative">
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={handleDateInput}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={() => shiftDate(1)}
          disabled={isLoading || isPending}
          className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {(isLoading || isPending) && (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400 ml-2" />
        )}
      </div>
    </div>
  );
}