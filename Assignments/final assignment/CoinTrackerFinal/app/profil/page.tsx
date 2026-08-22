"use client";

import { FormEvent, useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { inputClass, labelClass, primaryButtonClass } from "../components/FormFields";
import { useAuth } from "../context/AuthContext";
import { currencyOptions } from "../lib/format";

export default function ProfilPage() {
  const { profile, updateProfile, clearData } = useFinance();
  const { user } = useAuth();
  const [name, setName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setCurrency(profile.currency);
  }, [profile.name, profile.currency]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), email: user?.email ?? profile.email, currency });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
        <p className="mt-1 text-gray-500">Osnovne postavke CoinTracker računa.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-purple-900 p-6 text-white">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/15 text-2xl font-bold">
            {profile.name.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-5 text-xl font-bold">{profile.name}</h2>
          <p className="mt-1 text-sm text-purple-200">{user?.email}</p>
          <div className="mt-6 rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-purple-200">Valuta</p>
            <p className="mt-1 font-bold">{currencyOptions.find((option) => option.value === profile.currency)?.label ?? profile.currency}</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
          <p className="text-sm font-bold text-gray-900">Osobni podaci</p>
          <div className="mt-5 space-y-4">
            <label className={labelClass}>
              Ime i prezime
              <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className={labelClass}>
              E-mail računa
              <input className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`} type="email" value={user?.email ?? ""} readOnly />
            </label>
            <p className="-mt-2 text-xs text-gray-400">E-mail je vezan uz prijavu i podatke ovog korisnika.</p>
            <label className={labelClass}>
              Valuta
              <select
                className={inputClass}
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button className={primaryButtonClass}>{saved ? "Spremljeno ✓" : "Spremi promjene"}</button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-gray-900">Izbriši financijske podatke</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Ova opcija briše sve prihode, troškove, ciljeve štednje, budžete, dugove i poruke samo za trenutno prijavljeni račun. Kategorije u aplikaciji ostaju dostupne za nove unose.
        </p>
        <button
          onClick={() => {
            if (confirm("Želiš li izbrisati sve financijske podatke ovog računa?")) clearData();
          }}
          className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
        >
          Izbriši financijske podatke
        </button>
      </section>
    </div>
  );
}
