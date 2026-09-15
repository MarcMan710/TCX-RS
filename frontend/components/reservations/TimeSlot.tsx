"use client";

import React from "react";
import { Check, Lock } from "lucide-react";

export type SlotState = "available" | "booked" | "selected" | "disabled";

interface TimeSlotProps {
  time: string;
  state: SlotState;
  onClick?: () => void;
}

export default function TimeSlot({ time, state, onClick }: TimeSlotProps) {
  const isClickable = state === "available" || state === "selected";

  const getStyles = () => {
    switch (state) {
      case "selected":
        return "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/20";
      case "available":
        return "bg-slate-950 hover:bg-emerald-500/10 text-slate-200 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400";
      case "booked":
        return "bg-slate-900/60 text-slate-600 border-slate-900 cursor-not-allowed line-through";
      case "disabled":
      default:
        return "bg-slate-900/40 text-slate-700 border-slate-900 cursor-not-allowed opacity-50";
    }
  };

  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={isClickable ? onClick : undefined}
      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-mono font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 ${getStyles()}`}
    >
      {state === "selected" && <Check className="h-3.5 w-3.5" />}
      {state === "booked" && <Lock className="h-3 w-3" />}
      <span>{time}</span>
    </button>
  );
}