"use client";

import Link from "next/link";
import { useFinance } from "../context/FinanceContext";
import { euro, prettyDate } from "../lib/format";

export default function PregledPage() {
  const {
    transactions,
    savingsGoals,
    debts,
    budgets,
    totalIncome,
    totalExpenses,
    balance,
    totalSaved,
    totalDebt,
    profile,
  } = useFinance();
  const recent = transactions.slice(0, 5);
  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});
  const maxExpense = Math.max(1, ...Object.values(expenseByCategory));

  const budgetWarnings = budgets.filter((b) => (expenseByCategory[b.category] ?? 0) / b.limit >= 0.8);

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-purple-900">Dobrodošao natrag</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Financijski pregled</h1>
          <p className="mt-1 text-gray-500">Sve najvažnije informacije na jednom mjestu.</p>
        </div>
        <Link href="/troskovi" className="rounded-2xl bg-purple-900 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800">+ Nova transakcija</Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Stanje", value: euro(balance, profile.currency), note: "prihodi - troškovi", cls: "text-purple-900" },
          { label: "Prihodi", value: euro(totalIncome, profile.currency), note: `${transactions.filter((t) => t.type === "income").length} unosa`, cls: "text-emerald-600" },
          { label: "Troškovi", value: euro(totalExpenses, profile.currency), note: `${transactions.filter((t) => t.type === "expense").length} unosa`, cls: "text-rose-600" },
          { label: "Ušteđeno", value: euro(totalSaved, profile.currency), note: `${savingsGoals.length} aktivna cilja`, cls: "text-gray-900" },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.cls}`}>{card.value}</p>
            <p className="mt-1 text-xs text-gray-500">{card.note}</p>
          </div>
        ))}
      </section>

      {budgetWarnings.length > 0 && (
        <section className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-lg">!</div>
            <div>
              <p className="text-sm font-bold text-gray-900">Budžet upozorenje</p>
              <p className="mt-1 text-sm text-gray-600">
                {budgetWarnings.map((b) => b.category).join(", ")} {budgetWarnings.length === 1 ? "je blizu postavljenog limita." : "su blizu postavljenog limita."}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Potrošnja po kategorijama</p>
              <p className="text-xs text-gray-500">Na temelju svih unesenih troškova</p>
            </div>
            <Link href="/budzeti" className="text-sm font-semibold text-purple-900 hover:underline">Budžeti →</Link>
          </div>
          <div className="mt-6 space-y-4">
            {Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([category, amount]) => (
              <div key={category}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">{category}</span>
                  <span className="text-gray-500">{euro(amount, profile.currency)}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100">
                  <div className="h-3 rounded-full bg-purple-900" style={{ width: `${Math.max(7, (amount / maxExpense) * 100)}%` }} />
                </div>
              </div>
            ))}
            {Object.keys(expenseByCategory).length === 0 && (
              <div className="rounded-2xl bg-gray-50 px-5 py-8 text-center">
                <p className="text-sm font-semibold text-gray-700">Još nema unesenih troškova.</p>
                <p className="mt-1 text-xs text-gray-500">Dodaj prvi trošak kako bi se ovdje prikazala analiza po kategorijama.</p>
                <Link href="/troskovi" className="mt-4 inline-flex rounded-xl bg-purple-900 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-800">Dodaj trošak</Link>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Dugovanja</p>
              <p className="text-xs text-gray-500">Ukupno preostalo</p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{debts.filter((debt) => debt.remaining > 0).length} aktivna</span>
          </div>
          <p className="mt-5 text-3xl font-bold text-gray-900">{euro(totalDebt, profile.currency)}</p>
          <div className="mt-5 space-y-3">
            {debts.slice(0, 3).map((debt) => {
              const paid = debt.total > 0 ? Math.round(((debt.total - debt.remaining) / debt.total) * 100) : 100;
              return (
                <div key={debt.id} className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex justify-between text-sm"><span className="font-semibold">{debt.name}</span><span className="text-gray-500">{paid}%</span></div>
                  <div className="mt-2 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-purple-900" style={{ width: `${paid}%` }} /></div>
                </div>
              );
            })}
            {debts.length === 0 && <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">Nema unesenih dugovanja.</p>}
          </div>
          <Link href="/dugovi" className="mt-5 inline-flex text-sm font-semibold text-purple-900 hover:underline">Upravljaj dugovima →</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-semibold text-gray-900">Nedavne transakcije</p><p className="text-xs text-gray-500">Zadnjih pet unosa</p></div>
          </div>
          <div className="mt-4 divide-y divide-gray-100">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${t.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{t.type === "income" ? "↗" : "↘"}</div>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-900">{t.title}</p><p className="text-xs text-gray-500">{t.category} • {prettyDate(t.date)}</p></div>
                </div>
                <p className={`shrink-0 text-sm font-bold ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>{t.type === "income" ? "+" : "-"}{euro(t.amount, profile.currency)}</p>
              </div>
            ))}
            {recent.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm font-semibold text-gray-700">Tvoj CoinTracker je spreman.</p>
                <p className="mt-1 text-xs text-gray-500">Unesi prvi prihod ili trošak kako bi se ovdje pojavile transakcije.</p>
                <div className="mt-4 flex justify-center gap-2">
                  <Link href="/prihodi" className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Dodaj prihod</Link>
                  <Link href="/troskovi" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">Dodaj trošak</Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}
