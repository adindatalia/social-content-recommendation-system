"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/documentation", label: "Documentation" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4 gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-teal-600/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-[17px] tracking-tight text-zinc-900">SehatFlow Content</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[13px] font-bold tracking-wide transition pb-1 ${
                  isActive
                    ? "text-teal-700"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[17px] h-[2px] bg-teal-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-[10px] font-bold tracking-wider uppercase">
            Decision Support System
          </div>

          {/* Notification bell (decorative) */}
          <button
            type="button"
            aria-label="Notifikasi"
            className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profile menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-label="Menu profil"
              className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            </button>

            {profileOpen && (
              <>
                {/* backdrop to close on outside click */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 bg-white shadow-lg overflow-hidden z-20"
                >
                  <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">SehatFlow Content</p>
                      <p className="text-[10px] text-zinc-400 font-medium">Decision Support System</p>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/documentation"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition"
                    >
                      Tentang SehatFlow
                    </Link>

                    <div className="px-4 py-2.5">
                      <p className="text-xs font-semibold text-zinc-600">Profil</p>
                      <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                        Sistem belum memiliki autentikasi pengguna
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Versi Aplikasi
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600">v1.0.0</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
