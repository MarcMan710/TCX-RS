"use client";

import { Loader2 } from "lucide-react";

interface LoadingProps {
  variant?: "spinner" | "card" | "table" | "fullscreen";
  text?: string;
  count?: number;
}

export default function Loading({
  variant = "spinner",
  text = "Loading...",
  count = 3,
}: LoadingProps) {
  if (variant === "fullscreen") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <p className="text-sm font-medium text-slate-400">{text}</p>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-48 animate-pulse space-y-4"
          >
            <div className="h-5 bg-slate-800 rounded-lg w-3/4" />
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-800 rounded-md w-full" />
              <div className="h-3.5 bg-slate-800 rounded-md w-5/6" />
            </div>
            <div className="pt-4 flex justify-between items-center">
              <div className="h-8 bg-slate-800 rounded-xl w-24" />
              <div className="h-8 bg-slate-800 rounded-xl w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden w-full space-y-3 p-4">
        <div className="h-10 bg-slate-950 rounded-xl animate-pulse" />
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-slate-800/40 border border-slate-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Default: inline spinner block
  return (
    <div className="flex items-center justify-center space-x-2 py-8 text-slate-400">
      <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}