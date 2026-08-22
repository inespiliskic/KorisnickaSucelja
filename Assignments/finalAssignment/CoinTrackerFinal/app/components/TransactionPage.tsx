"use client";

import { FormEvent, useMemo, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { euro, prettyDate } from "../lib/format";
import Modal from "./Modal";
import { inputClass, labelClass, primaryButtonClass } from "./FormFields";

const expenseCategories = ["Hrana", "Prijevoz", "Računi", "Shopping", "Pretplate", "Zdravlje", "Zabava", "Ostalo"];
const incomeCategories = ["Plaća", "Freelance", "Stipendija", "Poklon", "Prodaja", "Ostalo"];

export default function TransactionPage({ type }: { type: "income" | "expense" }) {
  const { transactions, addTransaction, deleteTransaction, profile } = useFinance();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Sve");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(type === "income" ? "Plaća" : "Hrana");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const items = useMemo(() => transactions.filter((t) => t.type === type), [transactions, type]);
  const categories = type === "income" ? incomeCategories : expenseCategories;
  const filtered = items
    .filter((t) =>
      (categoryFilter === "Sve" || t.category === categoryFilter) &&
      (t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) =>
      sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount
    );
  const total = items.reduce((sum, t) => sum + t.amount, 0);
  const byCategory = items.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount;
    return acc;
  }, {});
  const maxCategory = Math.max(1, ...Object.values(byCategory));
  const isIncome = type === "income";

  function submit(event: FormEvent) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!title.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) return;
    addTransaction({ type, title: title.trim(), category, amount: numericAmount, date });
    setTitle("");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setOpen(false);
  }

  function exportCsv() {
    const rows = [["Naziv", "Kategorija", "Iznos", "Datum"], ...items.map((t) => [t.title, t.category, t.amount.toString(), t.date])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isIncome ? "cointracker-prihodi.csv" : "cointracker-troskovi.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isIncome ? "Prihodi" : "Troškovi"}</h1>
          <p className="mt-1 text-gray-500">{isIncome ? "Prati sve izvore prihoda i njihov udio." : "Analiziraj potrošnju i kontroliraj gdje odlazi novac."}</p>
        </div>
        <button onClick={() => setOpen(true)} className={primaryButtonClass}>+ {isIncome ? "Dodaj prihod" : "Dodaj trošak"}</button>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-sm font-semibold text-gray-900">Pregled po kategorijama</p><p className="text-xs text-gray-500">Automatski izračun iz unosa</p></div>
            <div className="text-right"><p className="text-xs text-gray-500">Ukupno</p><p className={`text-xl font-bold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>{euro(total, profile.currency)}</p></div>
          </div>
          <div className="mt-6 space-y-4">
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([name, value]) => (
              <div key={name}>
                <div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-gray-900">{name}</span><span className="text-gray-500">{euro(value, profile.currency)}</span></div>
                <div className="h-3 rounded-full bg-gray-100"><div className={`h-3 rounded-full ${isIncome ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${Math.max(7, (value / maxCategory) * 100)}%` }} /></div>
              </div>
            ))}
            {Object.keys(byCategory).length === 0 && <p className="py-8 text-center text-sm text-gray-400">Još nema podataka.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Brzi sažetak</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">Broj unosa</p><p className="mt-1 text-2xl font-bold text-gray-900">{items.length}</p></div>
            <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">Prosječan unos</p><p className="mt-1 text-2xl font-bold text-gray-900">{euro(items.length ? total / items.length : 0, profile.currency)}</p></div>
            <button onClick={exportCsv} className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50">Izvezi CSV</button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-sm font-semibold text-gray-900">Sve transakcije</p><p className="text-xs text-gray-500">Pretraži, filtriraj ili ukloni unos</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pretraži..." className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-purple-300" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
            >
              <option>Sve</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
            >
              <option value="desc">Najveći → najmanji</option>
              <option value="asc">Najmanji → najveći</option>
            </select>
          </div>
        </div>
        <div className="mt-5 divide-y divide-gray-100">
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${isIncome ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{isIncome ? "↗" : "↘"}</div>
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-900">{t.title}</p><p className="text-xs text-gray-500">{t.category} • {prettyDate(t.date)}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>{isIncome ? "+" : "-"}{euro(t.amount, profile.currency)}</span>
                <button onClick={() => deleteTransaction(t.id)} className="rounded-xl px-2 py-1.5 text-xs text-gray-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Izbriši">✕</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Nema transakcija koje odgovaraju filteru.</p>}
        </div>
      </section>

      <Modal title={isIncome ? "Dodaj novi prihod" : "Dodaj novi trošak"} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <label className={labelClass}>Naziv<input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isIncome ? "npr. Plaća za kolovoz" : "npr. Tjedna kupovina"} autoFocus /></label>
          <label className={labelClass}>Kategorija<select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className={labelClass}>Iznos ({profile.currency})<input className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0.01" step="0.01" placeholder="0.00" /></label>
          <label className={labelClass}>Datum<input className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} type="date" /></label>
          <button className={`${primaryButtonClass} w-full`} type="submit">Spremi</button>
        </form>
      </Modal>
    </div>
  );
}
