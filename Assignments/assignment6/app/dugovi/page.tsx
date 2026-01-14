export default function DugoviPage() {
  const debts = [
    { name: "Kredit", remaining: 8200, monthly: 220, status: "Aktivno" },
    { name: "Kartica", remaining: 640, monthly: 120, status: "U otplati" },
    { name: "Posudba", remaining: 180, monthly: 60, status: "Dogovoreno" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dugovanja</h1>
        <p className="mt-1 text-gray-500">Pregled aktivnih obveza i plan otplate.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Aktivna dugovanja</div>
              <div className="text-xs text-gray-500">Ukupno preostalo</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Preostalo</div>
              <div className="text-lg font-bold text-rose-600">€9.020</div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
            <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500">
              <div className="col-span-4">Naziv</div>
              <div className="col-span-3">Preostalo</div>
              <div className="col-span-3">Mjesečno</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            {debts.map((d) => (
              <div key={d.name} className="grid grid-cols-12 px-4 py-4 text-sm border-t border-gray-100">
                <div className="col-span-4 font-semibold text-gray-900">{d.name}</div>
                <div className="col-span-3 text-gray-600">€{d.remaining.toLocaleString("hr-HR")}</div>
                <div className="col-span-3 text-gray-600">€{d.monthly.toLocaleString("hr-HR")}</div>
                <div className="col-span-2 text-right">
                  <span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">{d.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Plan</div>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Fokusiraj se na najmanji dug (kartica) ili na najveću kamatnu stopu —
            ovisno o strategiji koja ti bolje odgovara.
          </p>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="text-xs text-gray-500">Sljedeća rata</div>
              <div className="mt-1 text-xl font-bold text-gray-900">€220</div>
              <div className="mt-1 text-xs text-gray-500">Za 6 dana</div>
            </div>
            <button className="w-full rounded-2xl bg-purple-900 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-800">
              Dodaj uplatu
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">Podsjetnici</div>
            <div className="text-xs text-gray-500">Da ne zaboraviš obveze</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {["Plati ratu kredita", "Provjeri limit kartice", "Dogovori povrat posudbe", "Postavi automatsku uplatu"].map(
            (t, i) => (
              <div key={i} className="rounded-2xl bg-gray-50 p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t}</div>
                  <div className="text-xs text-gray-500">Ovaj tjedan</div>
                </div>
                <div className="text-sm">✅</div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
