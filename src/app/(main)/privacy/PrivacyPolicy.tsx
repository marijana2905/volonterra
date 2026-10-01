'use client';

export default function PrivacyPolicy() {
  return (
    <div className="bg-card mx-auto max-w-3xl rounded-2xl p-8 shadow-md">
      <h1 className="text-foreground mb-8 text-center text-3xl font-bold">Pravila privatnosti</h1>

      <p className="text-muted-foreground mb-6">
        Ova pravila privatnosti objašnjavaju kako prikupljamo, koristimo i štitimo vaše lične
        podatke kada koristite našu web platformu <strong>Volonterra</strong>.
      </p>

      <hr className="border-border my-8" />

      <section>
        <h2 className="text-foreground mb-3 text-xl font-semibold">Prikupljanje podataka</h2>
        <p className="text-muted-foreground">
          Prikupljamo informacije koje nam dobrovoljno pružate prilikom registracije, prijavljivanja
          na volonterske akcije i interakcije sa sadržajem na sajtu. Ove informacije mogu
          uključivati vaše ime, prezime, e-mail adresu i druge podatke potrebne za funkcionisanje
          platforme.
        </p>
      </section>

      <hr className="border-border my-8" />

      <section>
        <h2 className="text-foreground mb-3 text-xl font-semibold">Korišćenje podataka</h2>
        <p className="text-muted-foreground">
          Vaše informacije koristimo za pružanje usluga, omogućavanje učestvovanja u volonterskim
          akcijama, poboljšanje korisničkog iskustva i komunikaciju s vama u vezi sa aktivnostima na
          platformi.
        </p>
      </section>

      <hr className="border-border my-8" />

      <section>
        <h2 className="text-foreground mb-3 text-xl font-semibold">Prava korisnika</h2>
        <p className="text-muted-foreground">
          Imate pravo da pristupite, izmenite ili obrišete svoje lične podatke koje smo prikupili.
          Takođe imate pravo da povučete saglasnost za obradu podataka u bilo kom trenutku.
        </p>
        <p className="text-muted-foreground mt-3">
          Za sve zahteve ili pitanja u vezi sa vašim podacima, možete nas kontaktirati putem
          e-maila:{' '}
          <a href="mailto:volonterra@outlook.com" className="text-primary font-medium underline">
            volonterra@outlook.com
          </a>
          .
        </p>
      </section>

      <hr className="border-border my-8" />

      <section>
        <h2 className="text-foreground mb-3 text-xl font-semibold">Bezbednost podataka</h2>
        <p className="text-muted-foreground">
          Vaši lični podaci se čuvaju i obrađuju uz primenu odgovarajućih tehničkih i organizacionih
          mera zaštite, kako bi se sprečio neovlašćen pristup, gubitak ili zloupotreba podataka.
        </p>
      </section>

      <hr className="border-border my-8" />

      <section>
        <h2 className="text-foreground mb-3 text-xl font-semibold">Izmene pravila privatnosti</h2>
        <p className="text-muted-foreground">
          Ova pravila privatnosti mogu se povremeno ažurirati kako bi odražavala promene u našim
          praksama ili iz zakonskih razloga. Preporučujemo da ih povremeno pregledate kako biste
          bili u toku s našim praksama.
        </p>
      </section>

      <hr className="border-border my-8" />

      <p className="text-muted-foreground text-center text-sm">
        Poslednje ažuriranje: <strong>oktobar 2025.</strong>
      </p>
    </div>
  );
}
