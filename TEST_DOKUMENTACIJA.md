# Faza testiranja

Implementirani su osnovni testovi koji pokrivaju ključne funkcionalnosti sistema evidencije nastave.

## Unit testovi (3 testa)
- **Profesor model** - proverena veza sa predmetima (profesor može imati više predmeta)
- **Student model** - provereno heširanje lozinke i sigurnost podataka
- **RasporedPredmet model** - validacija aktivnosti termina nastave (termin je aktivan kada je danas u određenom vremenu)

## Integration testovi (3 testa)
- **Autentifikacija profesora** - testiranje prijave profesora sa ispravnim podacima
- **Autentifikacija studenta** - testiranje prijave studenta sa ispravnim podacima  
- **Neuspešna prijava** - validacija odbacivanja neispravnih podataka za prijavu

## Frontend testovi (2 testa)
- **LoginPage komponenta** - proveren prikaz forme za prijavu sa svim potrebnim poljima
- **Validacija forme** - testiranje validacije obaveznih polja (email i lozinka)

## End-to-end testovi (2 testa)
- **Kompletni tok evidencije** - simuliran proces od prijave profesora do navigacije na evidenciju
- **Prijava različitih korisnika** - testiranje prijave profesora i verifikacija uspešnog pristupa

## Test podaci
Kreiran je TestDataSeeder sa osnovnim test podacima:
- Test administrator (admin@test.com)
- Test profesor (profesor@test.com) 
- Test student (student@test.com)
- Test predmet (Internet Tehnologije)

**Ukupno: 10 testova** koji pokrivaju osnovne funkcionalnosti sistema i potvrđuju da aplikacija ispunjava ključne zahteve za evidenciju nastave.
