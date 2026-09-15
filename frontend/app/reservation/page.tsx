"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";

interface CourtOption {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const COURTS_LIST: CourtOption[] = [
  { id: "court-1", name: "Court 1", type: "Indoor Synthetic", pricePerHour: 25 },
  { id: "court-2", name: "Court 2", type: "Wooden Parquet", pricePerHour: 20 },
  { id: "court-3", name: "Court 3", type: "Teraflex Rubber", pricePerHour: 22 },
  { id: "court-4", name: "Court 4", type: "VIP Synthetic", pricePerHour: 30 },
];

function ReservationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCourtId = searchParams.get("courtId") || COURTS_LIST[0].id;
  const initialDate = searchParams.get("date") || "2026-09-20";

  const [selectedCourtId, setSelectedCourtId] = useState<string>(initialCourtId);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Retrieve availability when court or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setError(null);
      setSelectedSlotId(null);

      try {
        // Replace with real API: await reservationService.getAvailability(selectedCourtId, selectedDate);
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Mock availability data for demonstration
        const mockSlots: TimeSlot[] = [
          { id: "slot-1", startTime: "08:00", endTime: "09:00", isAvailable: true },
          { id: "slot-2", startTime: "09:00", endTime: "10:00", isAvailable: false },
          { id: "slot-3", startTime: "10:00", endTime: "11:00", isAvailable: true },
          { id: "slot-4", startTime: "11:00", endTime: "12:00", isAvailable: true },
          { id: "slot-5", startTime: "13:00", endTime: "14:00", isAvailable: false },
          { id: "slot-6", startTime: "14:00", endTime: "15:00", isAvailable: true },
          { id: "slot-7", startTime: "15:00", endTime: "16:00", isAvailable: true },
          { id: "slot-8", startTime: "16:00", endTime: "17:00", isAvailable: false },
        ];

        setSlots(mockSlots);
      } catch (err: any) {
        setError("Failed to fetch available time slots.");
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedCourtId, selectedDate]);

  const handleConfirmReservation = async () => {
    if (!selectedSlotId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Replace with API call: await reservationService.createBooking({ courtId: selectedCourtId, date: selectedDate, slotId: selectedSlotId });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBookingSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to confirm reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCourt = COURTS_LIST.find((c) => c.id === selectedCourtId);
  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <Link
          href="/courts"
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Courts</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Book a Court</h1>
          <p className="text-slate-400 text-sm mt-1">
            Choose your preferred date, court, and time slot to confirm your reservation.
          </p>
        </div>

        {/* Success Modal / State */}
        {bookingSuccess ? (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Reservation Confirmed!</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Your court booking for <span className="text-emerald-400 font-semibold">{selectedCourt?.name}</span> on{" "}
              <span className="text-emerald-400 font-semibold">{selectedDate}</span> ({selectedSlot?.startTime} - {selectedSlot?.endTime}) is complete.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/reservations"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all"
              >
                View My Bookings
              </Link>
              <button
                onClick={() => setBookingSuccess(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-6 py-3 rounded-xl transition-all"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form & Slot Picker */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Error Banner */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 text-red-400 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Controls */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date:
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Court:
                  </label>
                  <div className="relative">
                    <Trophy className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <select
                      value={selectedCourtId}
                      onChange={(e) => setSelectedCourtId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm appearance-none"
                    >
                      {COURTS_LIST.map((court) => (
                        <option key={court.id} value={court.id}>
                          {court.name} ({court.type}) — ${court.pricePerHour}/hr
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Time Slots */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-emerald-400" />
                    <span>Available Times:</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedDate}
                  </span>
                </div>

                {isLoadingSlots ? (
                  <div className="py-12 text-center text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-emerald-400" />
                    <p className="text-sm">Fetching time slot availability...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slots.map((slot) => {
                      const isSelected = selectedSlotId === slot.id;

                      return (
                        <button
                          key={slot.id}
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                            !slot.isAvailable
                              ? "bg-slate-950/60 border-slate-850 text-slate-600 cursor-not-allowed opacity-60"
                              : isSelected
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm"
                              : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                          }`}
                        >
                          <span>
                            [{slot.startTime} - {slot.endTime}]
                          </span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              slot.isAvailable
                                ? isSelected
                                  ? "bg-emerald-500 text-slate-950 font-bold"
                                  : "bg-emerald-500/20 text-emerald-400"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {slot.isAvailable ? (isSelected ? "Selected" : "Available") : "Booked"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm pb-4 border-b border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Court</span>
                    <span className="font-semibold text-white">{selectedCourt?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date</span>
                    <span className="font-semibold text-white">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time</span>
                    <span className="font-semibold text-white">
                      {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rate</span>
                    <span className="font-semibold text-white">${selectedCourt?.pricePerHour} / hr</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 text-base font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-emerald-400">${selectedSlot ? selectedCourt?.pricePerHour : 0}</span>
                </div>

                <button
                  disabled={!selectedSlotId || isSubmitting}
                  onClick={handleConfirmReservation}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Reservation</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ReservationPageContent />
    </Suspense>
  );
}