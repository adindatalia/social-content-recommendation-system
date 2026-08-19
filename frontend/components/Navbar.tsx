"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/documentation", label: "Documentation" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4 gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-teal-600/30">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <span className="font-bold text-[17px] tracking-tight text-zinc-900">
            SehatFlow Content
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-7">
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
      </div>
    </header>
  );
}