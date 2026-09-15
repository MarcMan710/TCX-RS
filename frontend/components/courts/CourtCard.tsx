"use client";

import React from "react";
import Link from "next/link";
import { Trophy, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export type CourtStatus = "Available" | "Maintenance" | "Booked";

export interface Court {
  id: string;
  name: string;
  description: string;
  status: CourtStatus;
  hourlyRate?: number;
  imageUrl?: string;
}

interface CourtCardProps {
  court: Court;
  onBookClick?: (courtId: string) => void;
}

export default function CourtCard({ court, onBookClick }: CourtCardProps) {
  const getStatusBadge = (status: CourtStatus) => {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Available</span>
          </span>
        );
      case "Booked":
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <span>Booked</span>
          </span>
        );
      case "Maintenance":
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
            <XCircle className="h-3.5 w-3.5" />
            <span>Maintenance</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all group">
      {/* Top Banner / Image Area */}
      <div className="p-6 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{court.name}</h3>
              {court.hourlyRate && (
                <span className="text-xs text-slate-400 font-mono">
                  ${court.hourlyRate} / hour
                </span>
              )}
            </div>
          </div>
          <div>{getStatusBadge(court.status)}</div>
        </div>

        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {court.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between">
        <Link
          href={`/courts/${court.id}`}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          View Details
        </Link>

        {court.status === "Available" ? (
          <button
            onClick={() => onBookClick ? onBookClick(court.id) : null}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/10"
          >
            <span>Book Court</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-2 bg-slate-800 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}