import Link from "next/link";

const features = [
  {
    title: "Brz unos i pregled",
    desc: "Dodaj trošak ili prihod u par klikova i odmah vidi gdje odlazi novac.",
  },
  {
    title: "Kategorije i budžeti",
    desc: "Postavi limite po kategorijama i prati potrošnju kroz čitljive kartice.",
  },
  {
    title: "Štednja i dugovanja",
    desc: "Drži ciljeve na oku, prati rate i rokove bez tablica i kaosa.",
  },
];

const steps = [
  {
    title: "1) Unesi podatke",
    desc: "Brzo dodaj trošak ili prihod — forma je jednostavna i prilagođena mobitelu.",
  },
  {
    title: "2) Organiziraj po kategorijama",
    desc: "Filtriraj i uspoređuj razdoblja, kategorije i iznose.",
  },
  {
    title: "3) Donosi odluke",
    desc: "Vidljiv napredak štednje i jasna potrošnja pomažu u planiranju.",
  },
];

const testimonials = [
  {
    name: "Marija, Zagreb",
    quote:
      "Sve je pregledno i čitljivo. Super mi je što jednako dobro radi na mobitelu i na laptopu.",
  },
  {
    name: "Ivan, Split",
    quote: "Najviše mi pomažu kategorije i budžeti. Brzo vidim gdje pretjeram.",
  },
  {
    name: "Ana, Rijeka",
    quote: "Napokon pratim štednju bez excela. Dizajn je čist i logičan.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-[#F6F7FB]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-900/10 text-purple-900">
              ⚡
            </span>
            <span className="text-base font-bold text-gray-900">CoinTracker</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
            <a href="#features" className="hover:text-gray-900">
              Značajke
            </a>
            <a href="#how" className="hover:text-gray-900">
              Kako radi
            </a>
            <a href="#testimonials" className="hover:text-gray-900">
              Iskustva
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/profil"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-white md:inline-flex"
            >
              Prijava
            </Link>
            <Link
              href="/troskovi"
              className="inline-flex items-center justify-center rounded-xl bg-purple-900 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Otvori demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:px-8 sm:py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              Pregled financija bez stresa — jasno, brzo i pregledno.
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-gray-600 sm:text-lg">
              CoinTracker je moderna i korisniku prilagođena aplikacija za upravljanje financijama koja pomaže korisnicima
              učinkovito pratiti prihode, troškove, štednju i dugove. Pruža jasan pregled financijskog stanja putem
              interaktivnih grafikona i personaliziranih nadzornih ploča. Uz CoinTracker, korisnici mogu postavljati
              ciljeve štednje, pratiti budžete, upravljati dugovima te komunicirati s drugima o zajedničkim troškovima.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/troskovi"
                className="inline-flex items-center justify-center rounded-2xl bg-purple-900 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
              >
                Troškovi
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-100 hover:bg-gray-50"
              >
                Značajke
              </a>
            </div>
          </div>

          {/* App preview (generic, no "logged in" stats) */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Pregled aplikacije</p>
                <p className="mt-1 text-xs text-gray-500">Primjer layouta</p>
              </div>
              <span className="rounded-full bg-purple-900/10 px-3 py-1 text-xs font-semibold text-purple-900">
                UI preview
              </span>
            </div>

       

            {/* Charts: Štednja + Dugovanja */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Savings chart */}
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Štednja</p>
                  <span className="rounded-full bg-purple-900/10 px-2.5 py-1 text-[11px] font-semibold text-purple-900">
                    cilj
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">Napredak prema cilju (demo)</p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 w-[62%] rounded-full bg-purple-900" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-900">62%</span>
                    <span className="text-gray-500">preostalo 38%</span>
                  </div>
                </div>

                {/* Mini bars (months) */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Zadnja 4 mjeseca</p>
                  <div className="mt-2 flex items-end gap-2">
                    {[35, 55, 48, 70].map((h, i) => (
                      <div key={i} className="flex-1">
                        <div className="flex h-16 items-end rounded-xl bg-white p-2 ring-1 ring-gray-100">
                          <div
                            className="w-full rounded-lg bg-purple-900/30"
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Debt chart */}
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Dugovanja</p>
                  <span className="rounded-full bg-purple-900/10 px-2.5 py-1 text-[11px] font-semibold text-purple-900">
                    rate
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">Raspodjela po vrstama (demo)</p>

                {/* Donut (CSS conic-gradient) */}
                <div className="mt-4 flex items-center gap-4">
                  <div
                    className="h-20 w-20 rounded-full ring-1 ring-gray-200"
                    style={{
                      background:
                        "conic-gradient(rgba(88,28,135,0.85) 0 45%, rgba(88,28,135,0.35) 45% 75%, rgba(17,24,39,0.12) 75% 100%)",
                    }}
                    aria-hidden
                  />
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-900" />
                      <span>Kredit (45%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-900/50" />
                      <span>Kartica (30%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      <span>Ostalo (25%)</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming installments */}
                <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-900">Sljedeća rata</p>
                    <p className="text-[11px] text-gray-500">u 7 dana</p>
                  </div>
                  <div className="mt-2 h-2 w-full rounded bg-gray-200" />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500">napredak</span>
                    <span className="font-semibold text-gray-900">demo</span>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Značajke</h2>
            <p className="mt-3 text-gray-600" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-900/10 text-purple-900">
                  ✓
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Kako radi</h2>
              <p className="mt-3 text-gray-600">Jednostavan flow koji dobro izgleda na svim ekranima.</p>

              <ol className="mt-6 space-y-3">
                {steps.map((s) => (
                  <li key={s.title} className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/prihodi"
                  className="inline-flex items-center justify-center rounded-2xl bg-purple-900 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
                >
                  Vidi prihode
                </Link>
                <Link
                  href="/stednja"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-100 hover:bg-gray-50"
                >
                  Vidi štednju
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mt-2">
                <p className="text-sm font-semibold text-gray-900">Sekcije u aplikaciji</p>
                <p className="mt-1 text-xs text-gray-500">Primjer organizacije sadržaja (demo)</p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["Kategorije", "Budžeti", "Dugovanja", "Ciljevi"].map((t) => (
                  <div key={t} className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Sekcija</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{t}</p>
                    <div className="mt-3 h-2 w-full rounded bg-gray-200" />
                    <div className="mt-2 h-2 w-4/5 rounded bg-gray-200" />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-purple-900/5 p-4 ring-1 ring-purple-900/10">
                <p className="text-sm font-semibold text-gray-900">Tip</p>
                <p className="mt-1 text-sm text-gray-600">
                  Na mobitelu se sve slaže u 1 stupac; na većim ekranima prelazi u 2 stupca.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Iskustva korisnika</h2>
          <p className="mt-3 text-gray-600">Social proof sekcija kao dio high-fidelity landing dizajna.</p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <blockquote className="text-sm leading-6 text-gray-600">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-gray-900">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-900/10 text-purple-900">
                ⚡
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">CoinTracker</p>
                <p className="text-xs text-gray-500">Landing • Next.js • Tailwind</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <a href="#features" className="hover:text-gray-900">
                Značajke
              </a>
              <a href="#how" className="hover:text-gray-900">
                Kako radi
              </a>
              <Link href="/profil" className="hover:text-gray-900">
                Prijava
              </Link>
            </div>
          </div>

          <p className="mt-8 text-xs text-gray-400">© {new Date().getFullYear()} CoinTracker. Demo projekt za zadatak.</p>
        </div>
      </footer>
    </div>
  );
}
