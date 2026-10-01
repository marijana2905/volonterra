# VolonTerra

VolonTerra je platforma koja povezuje volontere i organizacije koje organizuju ekološke i društveno korisne akcije. Volonteri mogu da pronađu akcije i prijave se samostalno ili kao tim, a organizacije mogu da predstave svoj rad i upravljaju akcijama.

## Funkcionalnosti

- Javni pregled akcija, organizacija, volontera i blog objava.
- Nalozi za volontere, organizatore i administratore, sa potvrdom email adrese i resetovanjem lozinke.
- Kreiranje i uređivanje akcija, kategorije, lokacije, kapaciteti i upravljanje prijavama.
- Individualne i timske prijave, timske pozivnice i čet u realnom vremenu.
- Profili volontera i organizacija, zone interesovanja, galerija fotografija i statistika.
- Obaveštenja, pitanja organizacijama, utisci nakon akcija i izveštaj o aktivnostima.
- Administracija korisnika, organizacija, kategorija i blog sadržaja.

## Tehnologije

- Next.js 16 (App Router), React 19 i TypeScript
- Tailwind CSS 4 i Radix UI
- PostgreSQL, Prisma 7 i `@prisma/adapter-pg`
- Better Auth za autentifikaciju i upravljanje sesijama
- Cloudinary za slike, Nodemailer za email i zaseban Express/socket servis za timski čet i obaveštenja

## Preduslovi

- Node.js 20.9 ili noviji
- npm
- PostgreSQL baza podataka
- Git

Za slanje emailova, otpremanje slika i timski čet potrebne su i odgovarajuće spoljne usluge. Aplikacija može da se pokrene sa osnovnom konfiguracijom baze, ali te funkcije neće raditi dok se njihove integracije ne podese.

## Lokalno pokretanje

1. Klonirajte repozitorijum i instalirajte zavisnosti:

	```bash
	git clone https://github.com/marijana2905/volonterra.git
	cd volonterra
	npm install
	```

2. Napravite `.env` fajl u korenu projekta. Minimalna konfiguracija za bazu i lokalni URL:

	```dotenv
	DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/volonterra?schema=public"
	BETTER_AUTH_SECRET="replace-with-a-random-secret-of-at-least-32-characters"
	BETTER_AUTH_URL="http://localhost:3000"
	NEXT_PUBLIC_API_URL="http://localhost:3000"
	```

	Popunite `USER`, `PASSWORD` i naziv baze prema lokalnoj PostgreSQL instalaciji. Detalji za ostale integracije nalaze se u odeljku [Konfiguracija](#konfiguracija).

3. Generišite Prisma Client i napravite početnu migraciju baze:

	```bash
	npx prisma generate
	npx prisma migrate dev --name init
	```

	Repozitorijum trenutno ne sadrži `prisma/migrations`, pa se prva migracija kreira lokalno iz `prisma/schema.prisma`. Sačuvajte kreirane migracione fajlove u repozitorijumu kako bi ostala okruženja mogla da ih primene.

4. Pokrenite razvojni server:

	```bash
	npm run dev
	```

	Otvorite [http://localhost:3000](http://localhost:3000).

## Konfiguracija

| Varijabla | Namena |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string; obavezno. |
| `BETTER_AUTH_SECRET` | Tajni ključ koji Better Auth koristi za autentifikaciju. Postavite jedinstvenu, nasumičnu vrednost od najmanje 32 karaktera. |
| `BETTER_AUTH_URL` | Osnovni URL aplikacije za Better Auth; lokalno `http://localhost:3000`. |
| `NEXT_PUBLIC_API_URL` | Javni osnovni URL aplikacije; koriste ga auth klijent, linkovi u emailovima i metadata. |
| `ADMIN_EMAILS` | Email adrese koje pri registraciji dobijaju administratorsku ulogu, razdvojene tačkom-zarezom. |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USER`, `MAIL_PASS` | SMTP podešavanja za potvrdu naloga, reset lozinke i sistemske emailove. `MAIL_SECURE` je `true` ili `false`. |
| `APP_URL` | Rezervni osnovni URL koji email servis koristi ako `NEXT_PUBLIC_API_URL` nije postavljen. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Server-side Cloudinary podešavanja. |
| `CLOUDINARY_AVATAR_UPLOAD_PRESET` | Cloudinary upload preset za profilne slike. |
| `CLOUDINARY_ACTION_BANNER_UPLOAD_PRESET` | Cloudinary upload preset za banere akcija. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary naziv naloga potreban za direktno otpremanje slika iz pregledača. |
| `NEXT_PUBLIC_CLOUDINARY_GALLERY_UPLOAD_PRESET` | Upload preset za galeriju organizacije. |
| `NEXT_PUBLIC_EXPRESS_URL` | URL zasebnog Express/socket servisa koji koristi timski čet i obaveštenja o akcijama u zonama interesovanja. |

Javne varijable sa prefiksom `NEXT_PUBLIC_` dostupne su u pregledaču. Nikada ne izlažite `BETTER_AUTH_SECRET`, `MAIL_PASS` ili `CLOUDINARY_API_SECRET` javnim varijablama niti ih čuvajte u repozitorijumu.

## Komande

| Komanda | Opis |
| --- | --- |
| `npm run dev` | Pokreće Next.js razvojni server na portu 3000 uz Turbopack. |
| `npm run build` | Pravi produkcijsku verziju aplikacije. |
| `npm run start` | Pokreće prethodno izgrađenu produkcijsku verziju. |
| `npm run lint` | Pokreće ESLint nad projektom. |
| `npm run lint:fix` | Automatski primenjuje ESLint ispravke. |
| `npm run check-types` | Proverava TypeScript tipove. |
| `npx prisma generate` | Generiše Prisma Client u `src/generated/prisma`. |
| `npx prisma migrate dev` | Kreira i primenjuje migracije u razvojnoj bazi. |
| `npx prisma migrate deploy` | Primenuje postojeće migracije u produkciji. |

## Struktura projekta

```text
prisma/       Prisma šema i migracije
public/       Statički fajlovi i bedževi
src/actions/  Mutacije i serverske akcije grupisane po domenu
src/app/      Next.js stranice, dashboard i API rute
src/components/ Zajedničke i domenske React komponente
src/data/     Čitanje i dohvat podataka
src/hooks/    React hook-ovi za klijentsku logiku
src/lib/      Integracije i zajedničke biblioteke
src/schemas/  Zod šeme za validaciju
src/types/    Zajednički TypeScript tipovi
```

## Provere pre objave

```bash
npm run check-types
npm run lint
npm run build
```

Za produkciono okruženje podesite iste potrebne promenljive okruženja, primenite verzionisane migracije komandom `npx prisma migrate deploy`, a zatim pokrenite aplikaciju komandom `npm run start` nakon build-a.
