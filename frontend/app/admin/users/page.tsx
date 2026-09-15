"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  X,
  Loader2,
  CheckCircle2,
  AlertOctagon,
  UserCheck,
  UserX,
  ShieldAlert,
  MoreVertical
} from "lucide-react";

export type UserRole = "Customer" | "Admin" | "Staff";
export type AccountStatus = "Active" | "Suspended" | "Pending";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registrationDate: string; // YYYY-MM-DD format
  status: AccountStatus;
  totalBookings?: number;
}

const INITIAL_USERS: ManagedUser[] = [
  {
    id: "user-101",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Customer",
    registrationDate: "2026-01-15",
    status: "Active",
    totalBookings: 12,
  },
  {
    id: "user-102",
    name: "Sarah Connor",
    email: "sarah.c@example.com",
    role: "Customer",
    registrationDate: "2026-02-04",
    status: "Active",
    totalBookings: 5,
  },
  {
    id: "user-103",
    name: "Mike Ross",
    email: "mike.ross@example.com",
    role: "Staff",
    registrationDate: "2025-11-20",
    status: "Active",
    totalBookings: 0,
  },
  {
    id: "user-104",
    name: "Alex Rivera",
    email: "arivera@example.com",
    role: "Customer",
    registrationDate: "2026-05-18",
    status: "Suspended",
    totalBookings: 2,
  },
  {
    id: "user-105",
    name: "Emily Watson",
    email: "emily.w@example.com",
    role: "Admin",
    registrationDate: "2025-08-10",
    status: "Active",
    totalBookings: 0,
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUsers(INITIAL_USERS);
      } catch (err) {
        console.error("Failed to load user list", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtered list based on search, role, and status
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === "All" || u.role === selectedRole;
      const matchesStatus =
        selectedStatus === "All" || u.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  // Toggle user status between Active and Suspended
  const handleToggleStatus = async (userId: string, currentStatus: AccountStatus) => {
    const nextStatus: AccountStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUpdatingId(userId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
      );
    } catch (err) {
      alert("Failed to update user access status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Change user role
  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRole("All");
    setSelectedStatus("All");
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
              <h1 className="text-3xl font-extrabold text-white">Registered Users</h1>
              <p className="text-slate-400 text-sm mt-1">
                View user profiles, adjust access permissions, and manage account statuses.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Accounts</span>
              <span className="text-2xl font-bold text-emerald-400">{users.length}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-300">
            <Filter className="h-4 w-4 text-emerald-400" />
            <span>Filter User Accounts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="All">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>

              {(searchQuery || selectedRole !== "All" || selectedStatus !== "All") && (
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

        {/* Users Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl h-16 animate-pulse"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <AlertOctagon className="h-10 w-10 mx-auto mb-3 text-slate-600" />
            <p className="font-semibold text-white">No users found</p>
            <p className="text-sm mt-1">Try adjusting your search criteria or role filters.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="py-4 px-6">User Info</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Registration Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Access Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.map((usr) => (
                    <tr
                      key={usr.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-6 font-semibold text-white">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-slate-800 rounded-full text-slate-300">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{usr.name}</div>
                            <div className="flex items-center space-x-1 text-xs text-slate-400 font-normal mt-0.5">
                              <Mail className="h-3 w-3" />
                              <span>{usr.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        <select
                          value={usr.role}
                          disabled={updatingId === usr.id}
                          onChange={(e) =>
                            handleChangeRole(usr.id, e.target.value as UserRole)
                          }
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="Customer">Customer</option>
                          <option value="Staff">Staff</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>

                      {/* Registration Date */}
                      <td className="py-4 px-6 text-slate-300 font-mono text-xs">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>{usr.registrationDate}</span>
                        </div>
                      </td>

                      {/* Account Status */}
                      <td className="py-4 px-6">
                        {usr.status === "Active" && (
                          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Active</span>
                          </span>
                        )}

                        {usr.status === "Suspended" && (
                          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>Suspended</span>
                          </span>
                        )}

                        {usr.status === "Pending" && (
                          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Access Actions */}
                      <td className="py-4 px-6 text-right">
                        {updatingId === usr.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400 ml-auto" />
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(usr.id, usr.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all ${
                              usr.status === "Active"
                                ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {usr.status === "Active" ? (
                              <>
                                <UserX className="h-3.5 w-3.5" />
                                <span>Suspend Access</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3.5 w-3.5" />
                                <span>Activate Access</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}