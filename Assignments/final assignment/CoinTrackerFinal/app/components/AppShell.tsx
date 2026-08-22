"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const isLoginPage = pathname === "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoginPage && !user) router.replace("/");
  }, [hydrated, isLoginPage, router, user]);

  if (!hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[#F6F7FB]">
        <div className="rounded-3xl bg-white px-8 py-6 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100">
          Učitavanje CoinTrackera…
        </div>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-dvh bg-[#F6F7FB]">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-[#F6F7FB]/90 px-4 py-3 backdrop-blur md:hidden">
        <button onClick={() => setOpen(true)} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200">
          ☰ Meni
        </button>
        <span className="text-sm font-bold text-gray-900">CoinTracker</span>
        <div className="w-[72px]" />
      </div>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button className="absolute inset-0 bg-black/30" aria-label="Zatvori meni" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] overflow-y-auto bg-white shadow-xl">
            <div onClick={() => setOpen(false)}><Sidebar /></div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1440px]">
        <aside className="hidden md:block md:w-72 md:shrink-0"><Sidebar /></aside>
        <main className="min-w-0 w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
