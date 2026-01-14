"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);

  // Landing (home) nema sidebara
  if (isHome) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-[#F6F7FB]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-[#F6F7FB]/90 px-4 py-3 backdrop-blur md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200"
          aria-label="Open menu"
        >
          ☰ Meni
        </button>
        <span className="text-sm font-bold text-gray-900">CoinTracker</span>
        <div className="w-[72px]" />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <span className="text-sm font-bold text-gray-900">Izbornik</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Sidebar sadržaj */}
            <div onClick={() => setOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl">
        {/* Desktop sidebar */}
        <aside className="hidden md:block md:w-72 md:shrink-0">
          <Sidebar />
        </aside>

        {/* Content */}
        <main className="w-full px-4 py-6 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
