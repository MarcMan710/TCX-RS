"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  Users,
  Clock,
  ChevronRight,
  Plus,
  ShieldAlert,
  Settings,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  totalCourts: number;
  todaysReservations: number;
  totalUsers: number;
  availableSlotsToday: number;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  court: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Replace with real Auth state / context hook (e.g., useAuth())
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Simulate Auth & Admin Role Check
    const checkAdminAccess = async () => {
      // Mocking check: assume true for demonstration.
      // In production: if (!user || user.role !== 'admin') router.push('/login');
      const userHasAdminRole = true;

      if (!userHasAdminRole) {
        setIsAdmin(false);
        router.push("/login");
        return;
      }
      setIsAdmin(true);

      // 2. Fetch Dashboard Metrics
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        setStats({
          totalCourts: 6,
          todaysReservations: 14,
          totalUsers: 128,
          availableSlotsToday: 18,
        });

        setRecentActivities([
          {
            id: "act-1",
            user: "Alex Rivera",
            action: "Booked Court 1",
            court: "Court 1",
            time: "10 mins ago",
          },
          {
            id: "act-2",
            user: "Sarah Chen",
            action: "Cancelled Reservation",
            court: "Court 3",
            time: "25 mins ago",
          },
          {
            id: "act-3",
            user: "David Kim",
            action: "Booked Court 4 (VIP)",
            court: "Court 4",
            time: "1 hour ago",
          },
          {
            id: "act-4",
            user: "New User Registered",
            action: "Registered Account",
            court: "N/A",
            time: "2 hours ago",
          },
        ]);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  // Unauthorized State Banner
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md text-center">
          <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 text-sm mb-6">
            You must be authenticated as an administrator to access this area.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* 1. Dashboard Header */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Settings className="h-4 w-4" />
              <span>Admin Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">System Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Overview of court utilization, user registrations, and reservation schedules.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/courts"
              className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
            >
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>Add Court</span>
            </Link>
            <Link
              href="/admin/reservations"
              className="inline-flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Manage Bookings</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* 2. Overview Metrics Grid */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Key Metrics
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-32 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Metric 1: Total Courts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Total Courts</span>
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Trophy className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.totalCourts}
                </div>
                <div className="flex items-center space-x-1 text-xs text-emerald-400 mt-2 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>All courts operational</span>
                </div>
              </div>

              {/* Metric 2: Today's Reservations */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Today's Reservations</span>
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.todaysReservations}
                </div>
                <p className="text-xs text-slate-400 mt-2">Booked for today</p>
              </div>

              {/* Metric 3: Total Users */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Total Users</span>
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.totalUsers}
                </div>
                <p className="text-xs text-slate-400 mt-2">Registered accounts</p>
              </div>

              {/* Metric 4: Available Slots */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Available Slots</span>
                  <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.availableSlotsToday}
                </div>
                <p className="text-xs text-slate-400 mt-2">Slots open today</p>
              </div>
            </div>
          )}
        </section>

        {/* 3. Quick Navigation Cards */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Management & Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/admin/courts"
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Trophy className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                  Courts
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage courts, surface specs & pricing.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/time-slots"
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-800 text-teal-400 rounded-xl group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                  <Clock className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-teal-400 transition-colors">
                  Time Slots
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure operating hours & availability.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/reservations"
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-800 text-blue-400 rounded-xl group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                  <Calendar className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                  Reservations
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  View, approve, or cancel user bookings.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-800 text-indigo-400 rounded-xl group-hover:bg-indigo-500 group-hover:text-slate-950 transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">
                  Users
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage registered customer accounts.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* 4. Recent Activity Stream */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              <h2 className="font-bold text-white text-lg">Recent System Activity</h2>
            </div>
            <span className="text-xs text-slate-500">Live Updates</span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-950/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <span className="font-semibold text-white">{act.user}</span>
                      <span className="text-slate-400 mx-2">•</span>
                      <span className="text-slate-300">{act.action}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md">
                      {act.court}
                    </span>
                    <span className="text-slate-500">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}