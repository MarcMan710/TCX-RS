"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Clock,
  CalendarDays,
  Users,
  LogOut,
  ShieldCheck
} from "lucide-react";

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout = () => {} }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Courts", href: "/admin/courts", icon: Trophy },
    { label: "Time Slots", href: "/admin/timeslots", icon: Clock },
    { label: "Reservations", href: "/admin/reservations", icon: CalendarDays },
    { label: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base">Admin Portal</h2>
            <p className="text-xs text-slate-400">Management Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
          Main Navigation
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Footer Section */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
}