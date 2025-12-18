"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Početna stranica", icon: "🏠" },
  { href: "/profil", label: "Profil", icon: "👤" },
  { href: "/prihodi", label: "Prihodi", icon: "💸" },
  { href: "/troskovi", label: "Troškovi", icon: "🧾" },
  { href: "/stednja", label: "Štednja", icon: "🏦" },
  { href: "/dugovi", label: "Dugovanja", icon: "📌" },
  { href: "/objave", label: "Objave", icon: "📰" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 bg-white border-r border-gray-100">
      <div className="px-6 py-7">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-purple-900/10 grid place-items-center text-purple-900">
            ⚡
          </div>
          <div className="font-bold text-lg text-gray-900">CoinTracker</div>
        </div>
      </div>

      <nav className="px-4">
        <div className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition " +
                  (active
                    ? "bg-purple-900 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
                }
              >
                <span className={"text-base " + (active ? "" : "opacity-80")}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 px-2">
          <button
            type="button"
            className="w-full rounded-xl px-4 py-3 text-left text-sm text-gray-500 hover:bg-gray-50"
            onClick={() => alert("Demo: ovdje bi bila odjava.")}
          >
            🚪 Odjava
          </button>
        </div>
      </nav>
    </aside>
  );
}
