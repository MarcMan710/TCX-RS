"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  AlertTriangle,
  ArrowLeft,
  X,
  CheckCircle2,
  Clock,
  Wrench,
  Loader2,
} from "lucide-react";

export type CourtStatus = "Available" | "Maintenance" | "Disabled";

export interface Court {
  id: string;
  name: string;
  surfaceType: string;
  hourlyRate: number;
  status: CourtStatus;
}

const INITIAL_COURTS: Court[] = [
  {
    id: "court-1",
    name: "Court 1",
    surfaceType: "BWF Approved Synthetic Mat",
    hourlyRate: 25,
    status: "Available",
  },
  {
    id: "court-2",
    name: "Court 2",
    surfaceType: "Hardwood Flooring",
    hourlyRate: 20,
    status: "Maintenance",
  },
  {
    id: "court-3",
    name: "Court 3",
    surfaceType: "BWF Approved Synthetic Mat",
    hourlyRate: 25,
    status: "Available",
  },
  {
    id: "court-4",
    name: "Court 4",
    surfaceType: "Synthetic Rubber",
    hourlyRate: 18,
    status: "Disabled",
  },
];

export default function AdminCourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  // Form Field States
  const [formData, setFormData] = useState<{
    name: string;
    surfaceType: string;
    hourlyRate: number;
    status: CourtStatus;
  }>({
    name: "",
    surfaceType: "BWF Approved Synthetic Mat",
    hourlyRate: 25,
    status: "Available",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourts = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCourts(INITIAL_COURTS);
      } catch (err) {
        console.error("Failed to load courts", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourts();
  }, []);

  // Open Modal for Create or Edit
  const handleOpenModal = (court?: Court) => {
    if (court) {
      setEditingCourt(court);
      setFormData({
        name: court.name,
        surfaceType: court.surfaceType,
        hourlyRate: court.hourlyRate,
        status: court.status,
      });
    } else {
      setEditingCourt(null);
      setFormData({
        name: `Court ${courts.length + 1}`,
        surfaceType: "BWF Approved Synthetic Mat",
        hourlyRate: 25,
        status: "Available",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourt(null);
  };

  // Submit Handler for Save / Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (editingCourt) {
        // Update existing court
        setCourts((prev) =>
          prev.map((c) =>
            c.id === editingCourt.id ? { ...c, ...formData } : c
          )
        );
      } else {
        // Add new court
        const newCourt: Court = {
          id: `court-${Date.now()}`,
          ...formData,
        };
        setCourts((prev) => [...prev, newCourt]);
      }

      handleCloseModal();
    } catch (err) {
      alert("Failed to save court details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Court Quick Status (Available <-> Maintenance/Disabled)
  const handleToggleStatus = (courtId: string, currentStatus: CourtStatus) => {
    const nextStatus: CourtStatus =
      currentStatus === "Available" ? "Disabled" : "Available";

    setCourts((prev) =>
      prev.map((c) => (c.id === courtId ? { ...c, status: nextStatus } : c))
    );
  };

  // Delete Court
  const handleDeleteCourt = (courtId: string, courtName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${courtName}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setCourts((prev) => prev.filter((c) => c.id !== courtId));
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
              <h1 className="text-3xl font-extrabold text-white">Court Management</h1>
              <p className="text-slate-400 text-sm mt-1">
                Add, configure, update status, and manage facility court allocations.
              </p>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 text-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Court</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
                    <th className="py-4 px-6">Court Name</th>
                    <th className="py-4 px-6">Surface Type</th>
                    <th className="py-4 px-6">Hourly Rate</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {courts.map((court) => {
                    return (
                      <tr
                        key={court.id}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Court Name */}
                        <td className="py-4 px-6 font-bold text-white">
                          <div className="flex items-center space-x-2.5">
                            <Trophy className="h-4 w-4 text-emerald-400" />
                            <span>{court.name}</span>
                          </div>
                        </td>

                        {/* Surface Type */}
                        <td className="py-4 px-6 text-slate-300">
                          {court.surfaceType}
                        </td>

                        {/* Hourly Rate */}
                        <td className="py-4 px-6 font-mono font-semibold text-slate-200">
                          ${court.hourlyRate}/hr
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          {court.status === "Available" && (
                            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Available</span>
                            </span>
                          )}

                          {court.status === "Maintenance" && (
                            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                              <Wrench className="h-3.5 w-3.5" />
                              <span>Maintenance</span>
                            </span>
                          )}

                          {court.status === "Disabled" && (
                            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                              <PowerOff className="h-3.5 w-3.5" />
                              <span>Disabled</span>
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Toggle Quick Status */}
                            <button
                              onClick={() =>
                                handleToggleStatus(court.id, court.status)
                              }
                              title={
                                court.status === "Available"
                                  ? "Disable Court"
                                  : "Enable Court"
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-all ${
                                court.status === "Available"
                                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              }`}
                            >
                              {court.status === "Available" ? (
                                <>
                                  <PowerOff className="h-3.5 w-3.5" />
                                  <span>Disable</span>
                                </>
                              ) : (
                                <>
                                  <Power className="h-3.5 w-3.5" />
                                  <span>Enable</span>
                                </>
                              )}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenModal(court)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-all"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() =>
                                handleDeleteCourt(court.id, court.name)
                              }
                              title="Delete Court"
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

      {/* Modal: Add or Edit Court */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              {editingCourt ? `Edit ${editingCourt.name}` : "Add New Court"}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Configure details, surface materials, hourly pricing, and operating status.
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Court Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Court 5"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Surface Type
                </label>
                <input
                  type="text"
                  required
                  value={formData.surfaceType}
                  onChange={(e) =>
                    setFormData({ ...formData, surfaceType: e.target.value })
                  }
                  placeholder="e.g. BWF Synthetic Mat"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hourlyRate: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as CourtStatus,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
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
                  className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingCourt ? "Save Changes" : "Create Court"}</span>
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