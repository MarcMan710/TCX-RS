"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Trophy,
  User,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  X,
  Loader2,
  MoreVertical,
  Check,
  Ban
} from "lucide-react";

export type AdminReservationStatus = "Confirmed" | "Cancelled" | "Completed" | "Pending";

export interface SystemReservation {
  id: string;
  customerName: string;
  customerEmail: string;
  courtName: string;
  date: string; // YYYY-MM-DD format
  startTime: string;
  endTime: string;
  status: AdminReservationStatus;
  amount: number;
}

const INITIAL_RESERVATIONS: SystemReservation[] = [
  {
    id: "res-301",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    courtName: "Court 1",
    date: "2026-09-20",
    startTime: "08:00",
    endTime: "09:00",
    status: "Confirmed",
    amount: 25,
  },
  {
    id: "res-302",
    customerName: "Sarah Connor",
    customerEmail: "sarah.c@example.com",
    courtName: "Court 2",
    date: "2026-09-20",
    startTime: "09:00",
    endTime: "10:00",
    status: "Confirmed",
    amount: 20,
  },
  {
    id: "res-303",
    customerName: "Mike Ross",
    customerEmail: "mike.ross@example.com",
    courtName: "Court 3",
    date: "2026-09-20",
    startTime: "10:00",
    endTime: "11:00",
    status: "Completed",
    amount: 25,
  },
  {
    id: "res-304",
    customerName: "Alex Rivera",
    customerEmail: "arivera@example.com",
    courtName: "Court 1",
    date: "2026-09-21",
    startTime: "14:00",
    endTime: "15:00",
    status: "Cancelled",
    amount: 25,
  },
  {
    id: "res-305",
    customerName: "Emily Watson",
    customerEmail: "emily.w@example.com",
    courtName: "Court 4",
    date: "2026-09-21",
    startTime: "18:00",
    endTime: "19:00",
    status: "Confirmed",
    amount: 30,
  },
];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<SystemReservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourt, setSelectedCourt] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllReservations = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReservations(INITIAL_RESERVATIONS);
      } catch (err) {
        console.error("Failed to load reservations", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReservations();
  }, []);

  // Filter Logic: Customer, Court, Date, and Status
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      // Customer search filter (Name or Email)
      const matchesCustomer =
        res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      // Court filter
      const matchesCourt =
        selectedCourt === "All" || res.courtName === selectedCourt;

      // Status filter
      const matchesStatus =
        selectedStatus === "All" || res.status === selectedStatus;

      // Date filter
      const matchesDate = !selectedDate || res.date === selectedDate;

      return matchesCustomer && matchesCourt && matchesStatus && matchesDate;
    });
  }, [reservations, searchQuery, selectedCourt, selectedStatus, selectedDate]);

  // Update Reservation Status Handler
  const handleUpdateStatus = async (
    reservationId: string,
    newStatus: AdminReservationStatus
  ) => {
    setUpdatingId(reservationId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert("Failed to update reservation status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCourt("All");
    setSelectedStatus("All");
    setSelectedDate("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-3 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">All Customer Reservations</h1>
              <p className="text-slate-400 text-sm mt-1">
                Monitor, filter, and manage court bookings across all registered users.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Filters Controls Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-300">
            <Filter className="h-4 w-4 text-emerald-400" />
            <span>Filter Bookings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Customer */}
            <div className="relative">
              <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Filter by Court */}
            <div>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="All">All Courts</option>
                <option value="Court 1">Court 1</option>
                <option value="Court 2">Court 2</option>
                <option value="Court 3">Court 3</option>
                <option value="Court 4">Court 4</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Filter by Date */}
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {(searchQuery || selectedCourt !== "All" || selectedStatus !== "All" || selectedDate) && (
                <button
                  onClick={clearFilters}
                  title="Clear Filters"
                  className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800 rounded-xl transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl h-16 animate-pulse"
              />
            ))}
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 text-slate-600" />
            <p className="font-semibold text-white">No reservations found</p>
            <p className="text-sm mt-1">Try adjusting your search criteria or date filters.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Court</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Time Slot</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredReservations.map((res) => {
                    return (
                      <tr
                        key={res.id}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Customer */}
                        <td className="py-4 px-6 font-semibold text-white">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-2 bg-slate-800 rounded-full text-slate-400">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <div>{res.customerName}</div>
                              <div className="text-xs text-slate-500 font-normal">
                                {res.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Court */}
                        <td className="py-4 px-6 text-slate-200 font-medium">
                          <div className="flex items-center space-x-2">
                            <Trophy className="h-4 w-4 text-emerald-400" />
                            <span>{res.courtName}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 text-slate-300 font-mono">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            <span>{res.date}</span>
                          </div>
                        </td>

                        {/* Time */}
                        <td className="py-4 px-6 font-mono text-slate-200">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span>
                              {res.startTime} - {res.endTime}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          {res.status === "Confirmed" && (
                            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Confirmed</span>
                            </span>
                          )}

                          {res.status === "Completed" && (
                            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                              <span>Completed</span>
                            </span>
                          )}

                          {res.status === "Cancelled" && (
                            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Cancelled</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          {updatingId === res.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400 ml-auto" />
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              {res.status === "Confirmed" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(res.id, "Completed")
                                    }
                                    title="Mark as Completed"
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-all"
                                  >
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Complete</span>
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(res.id, "Cancelled")
                                    }
                                    title="Cancel Reservation"
                                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-all"
                                  >
                                    <Ban className="h-3.5 w-3.5" />
                                    <span>Cancel</span>
                                  </button>
                                </>
                              )}

                              {res.status === "Cancelled" && (
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(res.id, "Confirmed")
                                  }
                                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all"
                                >
                                  Re-confirm
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}