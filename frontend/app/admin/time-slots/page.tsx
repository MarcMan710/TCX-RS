"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  X,
  CheckCircle2,
  Loader2,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  peakHour: boolean;
}

const INITIAL_TIME_SLOTS: TimeSlot[] = [
  {
    id: "slot-1",
    startTime: "08:00",
    endTime: "09:00",
    isActive: true,
    peakHour: false,
  },
  {
    id: "slot-2",
    startTime: "09:00",
    endTime: "10:00",
    isActive: true,
    peakHour: false,
  },
  {
    id: "slot-3",
    startTime: "10:00",
    endTime: "11:00",
    isActive: true,
    peakHour: false,
  },
  {
    id: "slot-4",
    startTime: "11:00",
    endTime: "12:00",
    isActive: true,
    peakHour: false,
  },
  {
    id: "slot-5",
    startTime: "18:00",
    endTime: "19:00",
    isActive: true,
    peakHour: true,
  },
  {
    id: "slot-6",
    startTime: "19:00",
    endTime: "20:00",
    isActive: true,
    peakHour: true,
  },
];

export default function AdminTimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  // Form Field States
  const [formData, setFormData] = useState<{
    startTime: string;
    endTime: string;
    isActive: boolean;
    peakHour: boolean;
  }>({
    startTime: "08:00",
    endTime: "09:00",
    isActive: true,
    peakHour: false,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTimeSlots(INITIAL_TIME_SLOTS);
      } catch (err) {
        console.error("Failed to load time slots", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, []);

  // Open Modal for Create or Edit
  const handleOpenModal = (slot?: TimeSlot) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive,
        peakHour: slot.peakHour,
      });
    } else {
      setEditingSlot(null);
      setFormData({
        startTime: "12:00",
        endTime: "13:00",
        isActive: true,
        peakHour: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlot(null);
  };

  // Submit Handler for Save / Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (editingSlot) {
        // Update existing time slot
        setTimeSlots((prev) =>
          prev.map((s) =>
            s.id === editingSlot.id ? { ...s, ...formData } : s
          )
        );
      } else {
        // Add new time slot
        const newSlot: TimeSlot = {
          id: `slot-${Date.now()}`,
          ...formData,
        };
        setTimeSlots((prev) => [...prev, newSlot]);
      }

      handleCloseModal();
    } catch (err) {
      alert("Failed to save time slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Slot Active Status
  const handleToggleActive = (slotId: string) => {
    setTimeSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Delete Time Slot
  const handleDeleteSlot = (slotId: string, timeRange: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete time slot ${timeRange}?`
    );
    if (!confirmed) return;

    setTimeSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-teal-400 mb-3 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Time Slots Management</h1>
              <p className="text-slate-400 text-sm mt-1">
                Configure bookable hours, schedule windows, and peak pricing periods.
              </p>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-teal-500/20 text-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Time Slot</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-20 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="py-4 px-6">Time Range</th>
                    <th className="py-4 px-6">Classification</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {timeSlots.map((slot) => {
                    const timeRangeStr = `${slot.startTime} - ${slot.endTime}`;

                    return (
                      <tr
                        key={slot.id}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Time Range */}
                        <td className="py-4 px-6 font-mono font-bold text-white text-base">
                          <div className="flex items-center space-x-2.5">
                            <Clock className="h-4 w-4 text-teal-400" />
                            <span>{timeRangeStr}</span>
                          </div>
                        </td>

                        {/* Peak Hour Tag */}
                        <td className="py-4 px-6">
                          {slot.peakHour ? (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                              <span>Peak Hours</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                              <span>Standard</span>
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          {slot.isActive ? (
                            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                              <span>Inactive</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Toggle Active Switch */}
                            <button
                              onClick={() => handleToggleActive(slot.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-all ${
                                slot.isActive
                                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              }`}
                            >
                              {slot.isActive ? "Deactivate" : "Activate"}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenModal(slot)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-all"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteSlot(slot.id, timeRangeStr)}
                              title="Delete Time Slot"
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
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

      {/* Modal: Add or Edit Time Slot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              {editingSlot ? "Edit Time Slot" : "Add Time Slot"}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Define the start and end time block for user court reservations.
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.peakHour}
                    onChange={(e) =>
                      setFormData({ ...formData, peakHour: e.target.checked })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-0 h-4 w-4"
                  />
                  <div>
                    <span className="block text-sm font-medium text-white">Peak Hour Slot</span>
                    <span className="block text-xs text-slate-400">Apply surge or peak hour pricing rates</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0 h-4 w-4"
                  />
                  <div>
                    <span className="block text-sm font-medium text-white">Active Status</span>
                    <span className="block text-xs text-slate-400">Available for booking by customers</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingSlot ? "Save Changes" : "Create Slot"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}