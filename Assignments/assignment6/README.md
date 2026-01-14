# CoinTracker — Landing Page (Next.js + Tailwind)

Ovaj repozitorij sadrži **responsivnu landing/home stranicu** (desktop + mobile) i postojeće demo rute aplikacije (troškovi, prihodi, dugovi, štednja…).

## Live demo

- Public URL: **(unesi URL nakon deploya, npr. Vercel)**

## High-fidelity prototipi

- Figma link: **(unesi link)**
- Alternativno: exporti (PNG/PDF) u folderu `/design` (ako želiš)

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Lokalno pokretanje

```bash
npm install
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:3000`.

## Struktura

- `app/page.tsx` — landing/home stranica (responsivna)
- `app/components/` — UI komponente (npr. Sidebar, AppShell)
- `app/*/page.tsx` — postojeće demo rute (troskovi, prihodi, dugovi, stednja...)

## Napomene

- Landing stranica je **mobile-first** i koristi breakpoints (`sm/md/lg`) za desktop layout.
- Sidebar se automatski prikazuje na internim rutama (npr. `/troskovi`), a na `/` je skriven.
