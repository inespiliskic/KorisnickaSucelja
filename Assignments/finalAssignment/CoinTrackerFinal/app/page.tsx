"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, hydrated, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && user) router.replace("/pregled");
  }, [hydrated, router, user]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = mode === "login"
      ? await login(email, password)
      : await register(name, email, password);

    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Došlo je do pogreške.");
      return;
    }

    router.replace("/pregled");
  }

  return (
    <main className="min-h-dvh bg-[#F6F7FB] px-5 py-8 sm:px-8 lg:grid lg:place-items-center lg:py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-gray-100 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-purple-900 p-8 text-white sm:p-12 lg:p-14">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-xl font-bold">€</div>
              <div>
                <p className="text-xl font-bold">CoinTracker</p>
                <p className="text-xs text-purple-200">Pametnije osobne financije</p>
              </div>
            </div>

            <h1 className="mt-12 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Sve tvoje financije na jednom mjestu.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-purple-100 sm:text-lg">
              Prati prihode i troškove, postavi budžete, upravljaj štednjom i dugovima te pregledaj svoje financijsko stanje kroz jednostavan dashboard.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {["Prihodi i troškovi", "Budžeti po kategorijama", "Ciljevi štednje", "Praćenje dugovanja"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-xs">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -right-8 top-16 h-36 w-36 rounded-full bg-white/5" />
        </section>

        <section className="flex items-center p-7 sm:p-12 lg:p-14">
          <div className="w-full">
            <div className="mb-8">
              <p className="text-sm font-semibold text-purple-900">Dobrodošli</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {mode === "login" ? "Prijavite se u CoinTracker" : "Kreirajte svoj račun"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {mode === "login"
                  ? "Unesite e-mail i lozinku za pristup svom financijskom pregledu."
                  : "Registrirajte se vlastitim e-mailom. Nakon registracije odmah ćete biti prijavljeni."}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === "login" ? "bg-white text-purple-900 shadow-sm" : "text-gray-500"}`}
              >
                Prijava
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${mode === "register" ? "bg-white text-purple-900 shadow-sm" : "text-gray-500"}`}
              >
                Registracija
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "register" && (
                <label className="block text-sm font-semibold text-gray-700">
                  Ime i prezime
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    placeholder="npr. Ana Horvat"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-900 focus:ring-4 focus:ring-purple-900/10"
                  />
                </label>
              )}

              <label className="block text-sm font-semibold text-gray-700">
                E-mail
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ime@primjer.com"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-900 focus:ring-4 focus:ring-purple-900/10"
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Lozinka
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="Najmanje 6 znakova"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-900 focus:ring-4 focus:ring-purple-900/10"
                />
              </label>

              {error && (
                <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-purple-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Molimo pričekajte…" : mode === "login" ? "Prijavi se" : "Kreiraj račun"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-gray-400">
              Podaci za ovaj projekt spremaju se lokalno u vašem pregledniku.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
