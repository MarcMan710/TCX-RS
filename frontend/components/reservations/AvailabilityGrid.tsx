"use client";

import React from "react";
import TimeSlot, { SlotState } from "./TimeSlot";
import { Trophy, AlertCircle } from "lucide-react";

export interface CourtAvailability {
  courtId: string;
  courtName: string;
  slots: {
    time: string;
    status: "Available" | "Booked" | "Disabled";
  }[];
}

interface SelectedSlotInfo {
  courtId: string;
  courtName: string;
  time: string;
}

interface AvailabilityGridProps {
  timeHeaders: string[]; // e.g., ["08:00", "09:00", "10:00"]
  courtsData: CourtAvailability[];
  selectedSlot: SelectedSlotInfo | null;
  onSelectSlot: (slot: SelectedSlotInfo) => void;
  isLoading?: boolean;
}

export default function AvailabilityGrid({
  timeHeaders,
  courtsData,
  selectedSlot,
  onSelectSlot,
  isLoading = false,
}: AvailabilityGridProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/4" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-12 bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!courtsData || courtsData.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-slate-600" />
        <p className="font-semibold text-white">No grid data available</p>
        <p className="text-sm mt-1">Select another date to view available time slots.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Time Slot Headers */}
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800">
              <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[140px]">
                Court / Time
              </th>
              {timeHeaders.map((time) => (
                <th
                  key={time}
                  className="py-4 px-3 text-center text-xs font-mono font-semibold text-slate-300 min-w-[100px]"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>

          {/* Matrix Rows */}
          <tbody className="divide-y divide-slate-800/60">
            {courtsData.map((court) => (
              <tr key={court.courtId} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6 font-bold text-white">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{court.courtName}</span>
                  </div>
                </td>

                {timeHeaders.map((time) => {
                  const slotItem = court.slots.find((s) => s.time === time);
                  const isSelected =
                    selectedSlot?.courtId === court.courtId && selectedSlot?.time === time;

                  let slotState: SlotState = "disabled";
                  if (isSelected) {
                    slotState = "selected";
                  } else if (slotItem?.status === "Available") {
                    slotState = "available";
                  } else if (slotItem?.status === "Booked") {
                    slotState = "booked";
                  }

                  return (
                    <td key={time} className="py-3 px-2 text-center">
                      <TimeSlot
                        time={time}
                        state={slotState}
                        onClick={() =>
                          onSelectSlot({
                            courtId: court.courtId,
                            courtName: court.courtName,
                            time,
                          })
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}