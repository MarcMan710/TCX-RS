"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Trash2,
  PlusCircle
} from "lucide-react";

export interface Reservation {
  id: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "Confirmed" | "Cancelled" | "Completed";
  price: number;
}

// Mock initial data representing customer-owned reservations
const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "res-101",
    courtName: "Court 1",
    date: "2026-09-20",
    startTime: "08:00",
    endTime: "09:00",
    status: "Confirmed",
    price: 25,
  },
  {
    id: "res-102",
    courtName: "Court 3",
    date: "2026-09-22",
    startTime: "14:00",
    endTime: "15:00",
    status: "Confirmed",
    price: 22,
  },
  {
    id: "res-100",
    courtName: "Court 2",
    date: "2026-09-10",
    startTime: "10:00",
    endTime: "11:00",
    status: "Completed",
    price: 20,
  },
];

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Filter tab state
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    const fetchMyReservations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Replace with real backend service call:
        // const response = await reservationService.getUserReservations();
        // setReservations(response.data);

        await new Promise((resolve) => setTimeout(resolve, 600));
        setReservations(INITIAL_RESERVATIONS);
      } catch (err: any) {
        setError("Failed to load your reservations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReservations();
  }, []);

  const handleCancelReservation = async (reservationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmed) return;

    setCancellingId(reservationId);

    try {
      // Replace with real backend service call:
      // await reservationService.cancelReservation(reservationId);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: "Cancelled" } : res
        )
      );
    } catch (err: any) {
      alert("Failed to cancel reservation. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredReservations = reservations.filter((res) => {
    if (filter === "upcoming") return res.status === "Confirmed";
    if (filter === "past") return res.status !== "Confirmed";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Reservations</h1>
            <p className="text-slate-400 text-sm mt-1">
              View and manage your active and past badminton court bookings.
            </p>
          </div>

          <Link
            href="/reservation"
            className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Filter Controls */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-sm font-medium w-fit mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              filter === "all"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              filter === "upcoming"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              filter === "past"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Past & Cancelled
          </button>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="h-6 w-32 bg-slate-800 rounded-md" />
                  <div className="h-4 w-48 bg-slate-800/60 rounded-md" />
                  <div className="h-4 w-40 bg-slate-800/60 rounded-md" />
                </div>
                <div className="h-10 w-36 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error Banner */}
        {!isLoading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 max-w-lg mx-auto">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredReservations.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-6">
            <Calendar className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No reservations found</h3>
            <p className="text-slate-400 text-sm mb-6">
              You don't have any bookings matching the current filter.
            </p>
            <Link
              href="/reservation"
              className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              <span>Book a Court</span>
            </Link>
          </div>
        )}

        {/* Reservations List */}
        {!isLoading && !error && filteredReservations.length > 0 && (
          <div className="space-y-4">
            {filteredReservations.map((res) => {
              const isConfirmed = res.status === "Confirmed";
              const isCancelled = res.status === "Cancelled";

              return (
                <div
                  key={res.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="space-y-2">
                    {/* Court Name & Status */}
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-emerald-400" />
                        <span>{res.courtName}</span>
                      </h3>

                      {isConfirmed && (
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Status: Confirmed</span>
                        </span>
                      )}

                      {isCancelled && (
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Status: Cancelled</span>
                        </span>
                      )}

                      {res.status === "Completed" && (
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                          <span>Status: Completed</span>
                        </span>
                      )}
                    </div>

                    {/* Date & Time Slot Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>{res.date}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="font-mono text-slate-200">
                          {res.startTime} - {res.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Action */}
                  {isConfirmed && (
                    <div>
                      <button
                        disabled={cancellingId === res.id}
                        onClick={() => handleCancelReservation(res.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingId === res.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            <span>Cancel Reservation</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}