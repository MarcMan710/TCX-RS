"use client";

import React from "react";
import { Trophy, Calendar, Clock, CheckCircle2, XCircle, Ban } from "lucide-react";

export type CustomerReservationStatus = "Confirmed" | "Completed" | "Cancelled";

export interface CustomerReservation {
  id: string;
  courtName: string;
  date: string;
  timeSlot: string;
  status: CustomerReservationStatus;
  amount?: number;
}

interface ReservationCardProps {
  reservation: CustomerReservation;
  onCancel?: (reservationId: string) => void;
  isCancelling?: boolean;
}

export default function ReservationCard({
  reservation,
  onCancel,
  isCancelling = false,
}: ReservationCardProps) {
  const getStatusBadge = () => {
    switch (reservation.status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            <span>Completed</span>
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
            <XCircle className="h-3.5 w-3.5" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{reservation.courtName}</h3>
            {reservation.amount && (
              <span className="text-xs text-slate-400 font-mono">${reservation.amount} Paid</span>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-2 gap-3 py-3 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Calendar className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span className="font-mono">{reservation.date}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Clock className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span className="font-mono">{reservation.timeSlot}</span>
        </div>
      </div>

      {reservation.status === "Confirmed" && onCancel && (
        <div className="pt-2 border-t border-slate-800/80 flex justify-end">
          <button
            type="button"
            disabled={isCancelling}
            onClick={() => onCancel(reservation.id)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all disabled:opacity-50"
          >
            <Ban className="h-3.5 w-3.5" />
            <span>Cancel Reservation</span>
          </button>
        </div>
      )}
    </div>
  );
}