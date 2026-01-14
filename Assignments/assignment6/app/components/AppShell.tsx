"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <div className="min-h-dvh bg-[#F6F7FB] text-gray-900">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#F6F7FB] text-gray-800">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
