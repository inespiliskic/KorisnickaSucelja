# CoinTracker

CoinTracker je funkcionalna frontend aplikacija za upravljanje osobnim financijama izrađena u Next.js-u, Reactu, TypeScriptu i Tailwind CSS-u.

## Pokretanje

1. Otvorite terminal u folderu `CoinTracker`.
2. Instalirajte pakete:

```bash
npm install
```

3. Pokrenite aplikaciju:

```bash
npm run dev
```

Nakon što se razvojni server pokrene, CoinTracker automatski otvara `http://localhost:3000` u zadanom pregledniku.

Ako ne želite automatsko otvaranje preglednika, koristite:

```bash
npm run dev:no-open
```

## Prijava i registracija

Početna stranica je stranica za prijavu. Novi korisnik prvo odabere **Registracija**, unese ime, vlastiti e-mail i lozinku od najmanje 6 znakova. Nakon registracije odmah se prijavljuje i otvara se financijski pregled.

Pri sljedećem pokretanju koristi isti e-mail i lozinku kroz karticu **Prijava**.

Svaki registrirani e-mail ima vlastite lokalno spremljene:

- prihode i troškove
- budžete
- ciljeve štednje
- dugovanja
- poruke
- profil

Početni financijski podaci prikazuju se tek nakon prijave.

## Važno

Ova verzija koristi lokalnu autentikaciju i `localStorage`, što je prikladno za studentski projekt i demonstraciju funkcionalnosti. Ne koristi udaljeni backend ni bazu podataka, pa račun postoji samo u pregledniku/računalu u kojem je registriran. Za produkcijsku aplikaciju autentikaciju i podatke trebalo bi povezati s backendom i sigurnom bazom podataka.

## Windows / automatsko otvaranje preglednika

`npm run dev` koristi `scripts/dev-open.mjs`, koji lokalni Next.js pokreće direktno preko Nodea i nakon pokretanja otvara `http://localhost:3000` u zadanom pregledniku. Ovo izbjegava `spawn EINVAL` problem s `npx.cmd` na Windowsu.

Ako automatsko otvaranje preglednika iz nekog razloga nije dopušteno na računalu, aplikacija će i dalje biti dostupna na `http://localhost:3000`.

## Pohrana podataka u ovoj verziji

Ova lokalna studentska verzija ne koristi vanjsku bazu podataka. Registrirani korisnici, sesija i financijski podaci spremaju se u `localStorage` preglednika.

- korisnički računi: `cointracker-users-v1`
- aktivna prijava: `cointracker-session-v1`
- financijski podaci po korisniku: `cointracker-data-v3:<email>`

Novi korisnik nakon registracije počinje bez demo prihoda, troškova, štednje, dugova, budžeta i poruka. Kategorije za unos ostaju ugrađene u aplikaciju.

Za produkcijsku verziju preporučuje se backend baza i autentikacija, npr. Supabase/PostgreSQL, umjesto `localStorage` pohrane.
