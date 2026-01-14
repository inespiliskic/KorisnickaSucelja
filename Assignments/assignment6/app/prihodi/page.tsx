export default function PrihodiPage() {
  const sources = [
    { name: "Plaća", amount: 2150, change: "+2.1%" },
    { name: "Freelance", amount: 480, change: "+6.4%" },
    { name: "Pokloni", amount: 90, change: "-" },
  ];

  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const bars = [62, 58, 70, 64, 76, 72];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Prihodi</h1>
        <p className="mt-1 text-gray-500">Pregled izvora prihoda i trend kroz vrijeme.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Trend prihoda</div>
              <div className="text-xs text-gray-500">Zadnjih 6 mjeseci</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Ukupno (mjesec)</div>
              <div className="text-lg font-bold text-purple-900">€2.720</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-6 items-end gap-3 h-44">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-full rounded-2xl bg-purple-900/10 h-full">
                  <div className="w-full rounded-2xl bg-purple-900" style={{ height: `${h}%` }} />
                </div>
                <div className="text-[11px] text-gray-400">{months[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Sažetak</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="text-xs text-gray-500">Prosjek / mjesec</div>
              <div className="mt-1 text-xl font-bold text-gray-900">€2.540</div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="text-xs text-gray-500">Najbolji mjesec</div>
              <div className="mt-1 text-xl font-bold text-gray-900">Nov</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">Izvori prihoda</div>
            <div className="text-xs text-gray-500">Pregled po kategorijama</div>
          </div>
          <button className="rounded-2xl bg-purple-900 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800">
            Dodaj izvor
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
          <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500">
            <div className="col-span-6">Izvor</div>
            <div className="col-span-4">Iznos</div>
            <div className="col-span-2 text-right">Promjena</div>
          </div>
          {sources.map((s) => (
            <div key={s.name} className="grid grid-cols-12 px-4 py-4 text-sm border-t border-gray-100">
              <div className="col-span-6 font-semibold text-gray-900">{s.name}</div>
              <div className="col-span-4 text-gray-600">€{s.amount.toLocaleString("hr-HR")}</div>
              <div className="col-span-2 text-right text-gray-500">{s.change}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
