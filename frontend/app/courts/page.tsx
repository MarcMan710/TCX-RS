"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Wrench,
  ChevronRight
} from "lucide-react";

// Types matching your application definitions (types/court.ts)
export interface Court {
  id: string;
  name: string;
  type: "Indoor" | "Outdoor" | "VIP Synthetic" | "Wooden Parquet";
  surface: string;
  pricePerHour: number;
  status: "available" | "booked" | "maintenance";
  description?: string;
}

// Mock fallback data simulating an API response
const MOCK_COURTS: Court[] = [
  {
    id: "court-1",
    name: "Court 1",
    type: "Indoor",
    surface: "Professional Mat",
    pricePerHour: 25,
    status: "available",
    description: "BWF-certified synthetic mat with optimal grip and shock absorption.",
  },
  {
    id: "court-2",
    name: "Court 2",
    type: "Indoor",
    surface: "Wooden Parquet",
    pricePerHour: 20,
    status: "available",
    description: "Classic hardwood court providing consistent shuttle bounce.",
  },
  {
    id: "court-3",
    name: "Court 3",
    type: "Indoor",
    surface: "Teraflex Rubber",
    pricePerHour: 22,
    status: "booked",
    description: "High-density rubber surface for enhanced foot comfort.",
  },
  {
    id: "court-4",
    name: "Court 4",
    type: "VIP Synthetic",
    surface: "Premium Cushion",
    pricePerHour: 30,
    status: "available",
    description: "Spacious court with private seating and dedicated lighting.",
  },
  {
    id: "court-5",
    name: "Court 5",
    type: "Indoor",
    surface: "Standard Mat",
    pricePerHour: 18,
    status: "maintenance",
    description: "Currently undergoing net post and mat maintenance.",
  },
];

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available">("all");

  const fetchCourts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace with your actual backend service call, e.g.:
      // const response = await courtService.getAllCourts();
      // setCourts(response.data);

      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

      // Randomly simulate server error for demonstration (set to false in production)
      const simulateError = false;
      if (simulateError) {
        throw new Error("Unable to load courts from the server. Please try again.");
      }

      setCourts(MOCK_COURTS);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve court data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  // Filter logic
  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : court.status === "available";
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* 1. Page Header */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Trophy className="h-4 w-4" />
                <span>SmashPoint Venue</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">Badminton Courts</h1>
              <p className="text-slate-400 text-sm mt-1">
                Browse court specifications, real-time availability, and reserve your slot.
              </p>
            </div>

            {/* Filter / Search Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search courts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-sm font-medium">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === "all"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("available")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === "available"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Available
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* 2. Loading State (Skeletons) */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 animate-pulse flex flex-col justify-between h-64"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-5 w-24 bg-slate-800 rounded-md" />
                    <div className="h-5 w-20 bg-slate-800 rounded-md" />
                  </div>
                  <div className="h-7 w-40 bg-slate-800 rounded-md mb-3" />
                  <div className="h-4 w-full bg-slate-800/60 rounded-md mb-2" />
                  <div className="h-4 w-2/3 bg-slate-800/60 rounded-md" />
                </div>
                <div className="h-10 w-full bg-slate-800 rounded-xl mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* 3. API Error State */}
        {!isLoading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Failed to Load Courts</h3>
            <p className="text-slate-400 text-sm mb-6">{error}</p>
            <button
              onClick={fetchCourts}
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* 4. Empty State */}
        {!isLoading && !error && filteredCourts.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-12">
            <Filter className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No courts found</h3>
            <p className="text-slate-400 text-sm mb-6">
              No courts matched your search criteria or availability filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 5. Court Cards Grid */}
        {!isLoading && !error && filteredCourts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Court Component
function CourtCard({ court }: { court: Court }) {
  const isAvailable = court.status === "available";
  const isBooked = court.status === "booked";
  const isMaintenance = court.status === "maintenance";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg">
      <div>
        {/* Badge & Rate */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
            {court.type}
          </span>
          <div className="text-right">
            <span className="text-lg font-bold text-white">${court.pricePerHour}</span>
            <span className="text-xs text-slate-500"> / hr</span>
          </div>
        </div>

        {/* Name & Details */}
        <h3 className="text-xl font-bold text-white mb-1">{court.name}</h3>
        <p className="text-xs text-emerald-400 font-medium mb-3">{court.surface}</p>
        {court.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {court.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80">
        {/* Availability Status Indicators */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-slate-400">Status</span>
          {isAvailable && (
            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Available</span>
            </span>
          )}
          {isBooked && (
            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              <XCircle className="h-3.5 w-3.5" />
              <span>Fully Booked</span>
            </span>
          )}
          {isMaintenance && (
            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
              <Wrench className="h-3.5 w-3.5" />
              <span>Maintenance</span>
            </span>
          )}
        </div>

        {/* Action Button */}
        {isAvailable ? (
          <Link
            href={`/reservation?courtId=${court.id}`}
            className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/20"
          >
            <span>Book Now</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            disabled
            className="w-full inline-flex items-center justify-center space-x-1 bg-slate-950 text-slate-600 font-semibold py-2.5 px-4 rounded-xl border border-slate-800 cursor-not-allowed text-sm"
          >
            <span>Unavailable</span>
          </button>
        )}
      </div>
    </div>
  );
}