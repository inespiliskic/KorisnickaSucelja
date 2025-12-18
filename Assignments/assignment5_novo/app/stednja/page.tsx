export default function StednjaPage() {
  const goals = [
    { name: "Putovanje", target: 2000, saved: 1040 },
    { name: "Hitni fond", target: 3000, saved: 2180 },
    { name: "Novi laptop", target: 1400, saved: 560 },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Štednja</h1>
        <p className="mt-1 text-gray-500">Ciljevi štednje, napredak i planovi uplate.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Aktivni ciljevi</div>
              <div className="text-xs text-gray-500">3 cilja u tijeku</div>
            </div>
            <button className="rounded-2xl bg-purple-900 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800">
              Novi cilj
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
              return (
                <div key={g.name} className="rounded-3xl bg-gray-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{g.name}</div>
                      <div className="text-xs text-gray-500">Cilj: €{g.target.toLocaleString("hr-HR")}</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{pct}%</div>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-white">
                    <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span>Ušteđeno: €{g.saved.toLocaleString("hr-HR")}</span>
                    <span>Preostalo: €{Math.max(0, g.target - g.saved).toLocaleString("hr-HR")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Plan uplate</div>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Postavi automatsku uplatu jednom tjedno i brže dođi do cilja.
          </p>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="text-xs text-gray-500">Predloženo (tjedno)</div>
              <div className="mt-1 text-xl font-bold text-gray-900">€35</div>
            </div>
            <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
              Aktiviraj
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">Povijest uplata</div>
            <div className="text-xs text-gray-500">Zadnjih 5 uplata (demo)</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {["Putovanje", "Hitni fond", "Putovanje", "Novi laptop", "Hitni fond"].map((name, idx) => (
            <div key={idx} className="rounded-2xl bg-gray-50 p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900">{name}</div>
                <div className="text-xs text-gray-500">Prije {idx + 1} tjedna</div>
              </div>
              <div className="text-sm font-bold text-emerald-600">+€{(20 + idx * 5).toFixed(0)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
