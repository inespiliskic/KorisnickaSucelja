"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const nav = [
  { href: "/pregled", label: "Pregled", icon: "▦" },
  { href: "/prihodi", label: "Prihodi", icon: "↗" },
  { href: "/troskovi", label: "Troškovi", icon: "↘" },
  { href: "/budzeti", label: "Budžeti", icon: "◫" },
  { href: "/stednja", label: "Štednja", icon: "◎" },
  { href: "/dugovi", label: "Dugovanja", icon: "◇" },
  { href: "/poruke", label: "Poruke", icon: "✉" },
  { href: "/profil", label: "Profil", icon: "○" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/");
  }

  return (
    <aside className="flex min-h-dvh w-72 shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="px-6 py-7">
        <Link href="/pregled" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-900/10 font-bold text-purple-900">€</div>
          <div>
            <div className="text-lg font-bold text-gray-900">CoinTracker</div>
            <div className="text-[11px] text-gray-400">Pametnije financije</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-6">
        <div className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active ? "bg-purple-900 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={`grid h-6 w-6 place-items-center text-base ${active ? "text-white" : "text-gray-400"}`}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

      </nav>

      <div className="border-t border-gray-100 p-4">
        <div className="mb-3 rounded-2xl bg-gray-50 p-3">
          <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-gray-600 transition hover:bg-rose-50 hover:text-rose-700"
        >
          ↪ Odjavi se
        </button>
      </div>
    </aside>
  );
}
