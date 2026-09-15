"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Calendar,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout?: () => void;
}

export default function Navbar({
  isAuthenticated,
  userName = "User",
  onLogout = () => {},
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    `flex items-center space-x-1.5 text-sm font-medium transition-colors py-1 px-3 rounded-lg ${
      isActive(path)
        ? "text-emerald-400 bg-emerald-500/10"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / App Name */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
              <Trophy className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Court<span className="text-emerald-400">Book</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/courts" className={linkClass("/courts")}>
              Courts
            </Link>
            {isAuthenticated && (
              <Link href="/reservations" className={linkClass("/reservations")}>
                <Calendar className="h-4 w-4" />
                <span>My Reservations</span>
              </Link>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
                  <div className="p-1 bg-slate-800 rounded-full text-slate-400">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {userName}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-2 rounded-xl transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl transition-all"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-2 rounded-xl transition-all font-bold shadow-lg shadow-emerald-500/10"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-5 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            href="/courts"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Courts
          </Link>
          {isAuthenticated && (
            <Link
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              My Reservations
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full py-2 bg-rose-500/10 text-rose-400 rounded-xl text-sm font-semibold"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 py-2 bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 py-2 bg-emerald-400 text-slate-950 rounded-xl text-sm font-bold"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}