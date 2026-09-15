"use client";

import React from "react";
import CourtCard, { Court } from "./CourtCard";
import { AlertCircle } from "lucide-react";

interface CourtListProps {
  courts: Court[];
  onBookClick?: (courtId: string) => void;
}

export default function CourtList({ courts, onBookClick }: CourtListProps) {
  if (!courts || courts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-slate-600" />
        <p className="font-semibold text-white">No courts available</p>
        <p className="text-sm mt-1">Please check back later or modify your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courts.map((court) => (
        <CourtCard key={court.id} court={court} onBookClick={onBookClick} />
      ))}
    </div>
  );
}