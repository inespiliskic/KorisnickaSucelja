"use client";

import { FormEvent, useState } from "react";

import { useFinance } from "../context/FinanceContext";
import { euro } from "../lib/format";
import Modal from "../components/Modal";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "../components/FormFields";

export default function DugoviPage() {
  const {
    debts,
    totalDebt,
    addDebt,
    payDebt,
    deleteDebt,
    profile,
  } = useFinance();

  const [open, setOpen] = useState(false);
  const [payId, setPayId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [monthly, setMonthly] = useState("");
  const [payment, setPayment] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  function add(e: FormEvent) {
    e.preventDefault();

    const t = Number(total);

    // Mjesečna rata je opcionalna.
    // Ako korisnik ništa ne unese, vrijednost će biti 0.
    const m = monthly.trim() === "" ? 0 : Number(monthly);

    // Naziv i ukupan iznos su obavezni.
    if (!name.trim() || t <= 0) {
      return;
    }

    // Ako je rata unesena, mora biti veća od 0.
    if (monthly.trim() !== "" && m <= 0) {
      return;
    }

    addDebt({
      name: name.trim(),
      total: t,
      remaining: t,
      monthly: m,
    });

    setName("");
    setTotal("");
    setMonthly("");
    setOpen(false);
  }

  function pay(e: FormEvent) {
    e.preventDefault();

    const n = Number(payment);

    if (payId !== null && n > 0) {
      payDebt(payId, n);
    }

    setPayment("");
    setPayId(null);
  }

  const activeDebts = debts
    .filter((debt) => debt.remaining > 0)
    .sort((a, b) => sortOrder === "desc" ? b.remaining - a.remaining : a.remaining - b.remaining);

  const paidDebts = debts
    .filter((debt) => debt.remaining <= 0)
    .sort((a, b) => sortOrder === "desc" ? b.total - a.total : a.total - b.total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dugovanja
          </h1>

          <p className="mt-1 text-gray-500">
            Prati obveze i evidentiraj svaku otplatu.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className={primaryButtonClass}
        >
          + Dodaj dug
        </button>
      </header>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs text-gray-500">
            Ukupno preostalo
          </p>

          <p className="mt-2 text-2xl font-bold text-rose-600">
            {euro(totalDebt, profile.currency)}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs text-gray-500">
            Mjesečne obveze
          </p>

          <p className="mt-2 text-2xl font-bold">
            {euro(
              activeDebts.reduce(
                (sum, debt) => sum + debt.monthly,
                0
              ), profile.currency
            )}
          </p>
        </div>

        <div className="rounded-3xl bg-purple-900 p-5 text-white">
          <p className="text-xs text-purple-200">
            Aktivnih dugova
          </p>

          <p className="mt-2 text-2xl font-bold">
            {
              debts.filter(
                (debt) => debt.remaining > 0
              ).length
            }
          </p>
        </div>
      </section>

      {/* Debt list */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Aktivni dugovi</p>
            <p className="text-xs text-gray-500">Sortiraj prema preostalom iznosu.</p>
          </div>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as "desc" | "asc")}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-purple-300"
          >
            <option value="desc">Najveći → najmanji</option>
            <option value="asc">Najmanji → najveći</option>
          </select>
        </div>

        <div className="space-y-4">
          {activeDebts.map((debt) => {
            const paid = Math.round(
              ((debt.total - debt.remaining) /
                debt.total) *
                100
            );

            return (
              <div
                key={debt.id}
                className="rounded-2xl bg-gray-50 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-gray-900">
                      {debt.name}
                    </p>

                    {debt.monthly > 0 ? (
                      <p className="text-xs text-gray-500">
                        Mjesečna rata{" "}
                        {euro(debt.monthly, profile.currency)}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Bez mjesečne rate
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={debt.remaining <= 0}
                      onClick={() =>
                        setPayId(debt.id)
                      }
                      className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-purple-900 ring-1 ring-gray-200 disabled:opacity-50"
                    >
                      Uplati
                    </button>

                    <button
                      onClick={() =>
                        deleteDebt(debt.id)
                      }
                      className="rounded-xl px-3 py-2 text-xs text-gray-400 hover:text-rose-600"
                    >
                      Ukloni
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-xs text-gray-500">
                  <span>
                    Preostalo {euro(debt.remaining, profile.currency)}
                  </span>

                  <span>
                    {Math.min(100, paid)}% otplaćeno
                  </span>
                </div>

                <div className="mt-2 h-3 rounded-full bg-white">
                  <div
                    className="h-3 rounded-full bg-purple-900"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, paid)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        {activeDebts.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">Nema aktivnih dugova.</p>
          )}
        </div>
      </section>

      {/* Repaid debts history */}
      {paidDebts.length > 0 && (
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900">Vraćeni dugovi</p>
            <p className="text-xs text-gray-500">Dugovi ostaju zabilježeni, ali se više ne računaju kao aktivni.</p>
          </div>

          <div className="space-y-3">
            {paidDebts.map((debt) => (
              <div key={debt.id} className="flex flex-col gap-3 rounded-2xl bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{debt.name}</p>
                  <p className="text-xs text-gray-500">Ukupno {euro(debt.total, profile.currency)} • Vraćeno u cijelosti</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Vraćen ✓</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Add debt modal */}
      <Modal
        title="Dodaj dug"
        open={open}
        onClose={() => setOpen(false)}
      >
        <form
          onSubmit={add}
          className="space-y-4"
        >
          {/* Name */}
          <label className={labelClass}>
            Naziv

            <input
              className={inputClass}
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="npr. Kredit za auto"
              required
            />
          </label>

          {/* Total amount */}
          <label className={labelClass}>
            Ukupan iznos ({profile.currency})

            <input
              className={inputClass}
              type="number"
              min="1"
              step="0.01"
              value={total}
              onChange={(e) =>
                setTotal(e.target.value)
              }
              required
            />
          </label>

          {/* Monthly payment - OPTIONAL */}
          <label className={labelClass}>
            Mjesečna rata ({profile.currency})
            <span className="ml-1 text-xs font-normal text-gray-400">
              (opcionalno)
            </span>

            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              value={monthly}
              onChange={(e) =>
                setMonthly(e.target.value)
              }
              placeholder="npr. 150"
            />
          </label>

          <button
            type="submit"
            className={`${primaryButtonClass} w-full`}
          >
            Spremi dug
          </button>
        </form>
      </Modal>

      {/* Payment modal */}
      <Modal
        title="Evidentiraj uplatu"
        open={payId !== null}
        onClose={() => setPayId(null)}
      >
        <form
          onSubmit={pay}
          className="space-y-4"
        >
          <label className={labelClass}>
            Iznos uplate ({profile.currency})

            <input
              autoFocus
              className={inputClass}
              type="number"
              min="0.01"
              step="0.01"
              value={payment}
              onChange={(e) =>
                setPayment(e.target.value)
              }
              required
            />
          </label>

          <button
            type="submit"
            className={`${primaryButtonClass} w-full`}
          >
            Potvrdi uplatu
          </button>
        </form>
      </Modal>
    </div>
  );
}