export default function TroskoviPage() {
  const categories = [
    { name: "Hrana", amount: 420, pct: 32 },
    { name: "Prijevoz", amount: 160, pct: 12 },
    { name: "Računi", amount: 310, pct: 24 },
    { name: "Shopping", amount: 210, pct: 16 },
    { name: "Ostalo", amount: 210, pct: 16 },
  ];

  const last = [
    { what: "Konzum", when: "Danas", amount: 24.8 },
    { what: "Gorivo", when: "Jučer", amount: 55.0 },
    { what: "Netflix", when: "Prije 2 dana", amount: 9.99 },
    { what: "Kava", when: "Prije 3 dana", amount: 4.2 },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Troškovi</h1>
        <p className="mt-1 text-gray-500">Analiza potrošnje po kategorijama i zadnje transakcije.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Kategorije</div>
              <div className="text-xs text-gray-500">Mjesecni pregled</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Ukupno</div>
              <div className="text-lg font-bold text-rose-600">€1.310</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {categories.map((c) => (
              <div key={c.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                  <div className="text-sm text-gray-600">€{c.amount.toLocaleString("hr-HR")}</div>
                </div>
                <div className="h-3 rounded-full bg-gray-100">
                  <div className="h-3 rounded-full bg-rose-500" style={{ width: `${c.pct}%` }} />
                </div>
                <div className="text-xs text-gray-400">{c.pct}% udio</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Savjet</div>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Postavi tjedni limit za kategoriju <span className="font-semibold">Hrana</span>.
            Prati napredak i dobivaj obavijesti kad se približiš limitu.
          </p>
          <button className="mt-5 w-full rounded-2xl bg-purple-900 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-800">
            Postavi limit
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">Zadnje transakcije</div>
            <div className="text-xs text-gray-500">Automatski uvoz (demo)</div>
          </div>
          <button className="text-sm font-semibold text-purple-900 hover:underline">Izvoz</button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {last.map((t) => (
            <div key={t.what} className="rounded-2xl bg-gray-50 p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900">{t.what}</div>
                <div className="text-xs text-gray-500">{t.when}</div>
              </div>
              <div className="text-sm font-bold text-rose-600">-€{t.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
