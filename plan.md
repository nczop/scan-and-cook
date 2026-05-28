# Scan and Cook — plan działania

> **Nazwa aplikacji:** Scan and Cook
>
> **Cel:** projekt portfolio przy rekrutacjach. Próg wejścia dla rekrutera musi być zerowy — żadnego ekranu logowania na starcie.

## 1. Czym jest aplikacja

Cyfrowy przepiśnik. Użytkownik dodaje przepis na dwa sposoby:

1. **Ręcznie** — wypełnia formularz.
2. **Ze zdjęcia** — robi zdjęcie strony zeszytu (mobile) lub wgrywa plik (desktop). AI (Claude) odczytuje przepis, parsuje do struktury i wstępnie wypełnia formularz. Użytkownik edytuje i zapisuje.

Aplikacja udostępnia listę przepisów, podgląd, edycję i usuwanie. Każdy użytkownik widzi wyłącznie własne przepisy.

**Pierwsze wejście (kluczowe dla portfolio):** rekruter wchodzi na stronę i od razu jest w aplikacji — bez logowania, bez rejestracji. Pod spodem tworzy się anonimowe konto Supabase, dostaje 2-3 przykładowe przepisy z seeda. Może wszystko: skanować, dodawać, edytować. Gdy chce zachować swoje przepisy na stałe, klika **„Załóż konto”** i linkujemy email do tego samego konta — dane zostają.

## 2. Stack technologiczny

| Warstwa | Wybór | Uzasadnienie |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Server Components, Route Handlers (ukryty klucz Claude API), gotowy deploy na Vercel |
| Styling | **Tailwind CSS + shadcn/ui** | Szybkie, profesjonalnie wyglądające komponenty |
| Formularze | **React Hook Form** | Lider w ekosystemie React, `useFieldArray` do składników i kroków |
| Walidacja | **Zod** | Jeden schemat → formularz + odpowiedź AI + typy TypeScript |
| Data fetching | **TanStack Query** (mutacje, listy z filtrami) + Server Components (szczegóły) | Cache, optymistyczne aktualizacje |
| Baza + Auth + Storage | **Supabase** (region `eu-central-1` Frankfurt) z **Anonymous Sign-ins** | Darmowy tier, RLS, anonymous → linked user flow |
| AI | **Claude API (Anthropic)** | Structured output, świetnie czyta pismo odręczne, dobry polski |
| Hosting | **Vercel** | Idealna integracja z Next.js, free tier |
| Testy E2E | **Playwright** | Pokrycie głównego flow, dobrze wygląda w portfolio |
| CI | **GitHub Actions** | Lint + typecheck + testy na każdy push |

## 3. Schemat bazy danych

### Tabela `profiles`
Rozszerzenie `auth.users`:

- `id` (uuid, PK, referencja do `auth.users.id`)
- `email` (text, nullable — anonimowi userzy go nie mają)
- `display_name` (text, nullable)
- `is_anonymous` (boolean) — flaga ułatwiająca filtry i cleanup
- `created_at` (timestamptz)

### Tabela `recipes`

- `id` (uuid, PK)
- `user_id` (uuid, FK → `auth.users.id`)
- `title` (text, NOT NULL)
- `ingredients` (jsonb) — tablica obiektów `{ amount, unit, customUnit, name }` (szczegóły w sekcji 4a)
- `steps` (jsonb) — tablica stringów
- `notes` (text, nullable)
- `is_seed` (boolean, default false) — odróżnia przepisy demo od dodanych przez usera
- `source_image_url` (text, nullable) — *poza MVP*
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### RLS (Row Level Security)

Wszystkie operacje na `recipes` ograniczone przez `user_id = auth.uid()`. Insert wymaga zalogowanego usera (anonimowego lub nie — oba mają `auth.uid()`). Profile widoczne tylko dla właściciela.

### Cleanup anonimowych kont

Scheduled Edge Function w Supabase (cron co 24h): usuń wszystkich anonimowych userów (`is_anonymous = true`) starszych niż 7 dni wraz z ich przepisami (cascade). Zapobiega zaśmiecaniu bazy.

## 4. Schemat Zod (jedno źródło prawdy)

```ts
import { z } from "zod";

export const UNIT_KEYS = [
  "g", "dag", "kg",
  "ml", "l",
  "lyzka", "lyzeczka", "szklanka",
  "szt", "zabek", "garsc", "szczypta", "listek", "glowka",
] as const;

export const IngredientSchema = z.object({
  amount: z.number().nullable(),
  unit: z.enum(UNIT_KEYS).nullable(),     // canonical singular key (np. "lyzka")
  customUnit: z.string().nullable(),       // gdy user wpisał własną jednostkę
  name: z.string().min(1),
});

export const RecipeSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  ingredients: z.array(IngredientSchema).min(1, "Dodaj co najmniej jeden składnik"),
  steps: z.array(z.string().min(1)).min(1, "Dodaj co najmniej jeden krok"),
  notes: z.string().nullable(),
});

export type Recipe = z.infer<typeof RecipeSchema>;
```

Ten sam schemat jest używany przez:

1. `zodResolver` w React Hook Form (walidacja formularza),
2. walidację odpowiedzi z Claude (`RecipeSchema.safeParse(aiResponse)`),
3. typy TypeScript w całej aplikacji.

## 4a. Jednostki miary i polska odmiana

Polski odmienia rzeczowniki przez liczbę (1 łyżka, 2-4 łyżki, 5+ łyżek), więc nie możemy traktować jednostek jako zwykłego stringa. Strategia:

**Combobox zamiast dropdowna** — w UI pole jednostki to combobox (shadcn `Command` + `Popover`). User wybiera z listy ~15 typowych jednostek albo wpisuje własną. Z listy → trafia do `unit` (jako canonical key, np. `"lyzka"`). Własna → trafia do `customUnit` jako wolny string.

**Canonical singular w bazie** — zapisujemy `"lyzka"` niezależnie od tego ile sztuk jest w przepisie. Odmianę robimy dopiero na wyświetlaniu.

**Pluralizacja przez `Intl.PluralRules('pl-PL')`** — wbudowane w JavaScript, zero bibliotek:

```ts
const pluralRules = new Intl.PluralRules("pl-PL");
pluralRules.select(1); // "one"
pluralRules.select(3); // "few"
pluralRules.select(7); // "many"
```

**Słownik form per jednostka** (`lib/units.ts`):

```ts
export const UNITS = {
  // odmienne
  lyzka:    { one: "łyżka",    few: "łyżki",    many: "łyżek" },
  lyzeczka: { one: "łyżeczka", few: "łyżeczki", many: "łyżeczek" },
  szklanka: { one: "szklanka", few: "szklanki", many: "szklanek" },
  zabek:    { one: "ząbek",    few: "ząbki",    many: "ząbków" },
  szczypta: { one: "szczypta", few: "szczypty", many: "szczypt" },
  garsc:    { one: "garść",    few: "garście",  many: "garści" },
  listek:   { one: "listek",   few: "listki",   many: "listków" },
  glowka:   { one: "główka",   few: "główki",   many: "główek" },
  szt:      { one: "szt.",     few: "szt.",     many: "szt." },
  // nieodmienne (skróty)
  g:   { one: "g",   few: "g",   many: "g"   },
  dag: { one: "dag", few: "dag", many: "dag" },
  kg:  { one: "kg",  few: "kg",  many: "kg"  },
  ml:  { one: "ml",  few: "ml",  many: "ml"  },
  l:   { one: "l",   few: "l",   many: "l"   },
} satisfies Record<typeof UNIT_KEYS[number], { one: string; few: string; many: string }>;

export function formatIngredient(i: Ingredient): string {
  if (i.amount === null) return i.name;
  if (i.customUnit) return `${i.amount} ${i.customUnit} ${i.name}`;
  if (!i.unit) return `${i.amount} ${i.name}`;
  const form = pluralRules.select(i.amount);
  const key = form === "other" ? "many" : (form as "one" | "few" | "many");
  return `${i.amount} ${UNITS[i.unit][key]} ${i.name}`;
}
```

**Prompt do Claude'a** — w `lib/ai/parse-recipe.ts` dajemy modelowi listę dozwolonych `unit` keys z przykładami i instrukcję: „dopasuj do listy, jeśli żadna nie pasuje wpisz w `customUnit`, dla `pół` daj `amount: 0.5`, `unit` w canonical singular (`lyzka`, nie `łyżek`)". Zod waliduje strukturę po fakcie.

**Edge cases:**

- **Brak ilości** (sól do smaku): `amount=null, unit=null, customUnit=null, name="sól, pieprz do smaku"` → display: tylko nazwa.
- **Brak jednostki** (1 cebula, 3 jajka): `amount=1, unit=null, name="cebula"` → display: `"1 cebula"`. Nie odmieniamy nazw (to wolny tekst, user wpisuje w odpowiedniej formie).
- **Custom jednostka** (1 pudełko makaronu): `amount=1, customUnit="pudełko", name="makaronu"` → display literalny, bez odmiany.
- **Ułamki** (`pół łyżki`): AI zwraca `amount=0.5`. `Intl.PluralRules` zwraca `"other"` dla 0.5 — mapujemy na `"many"` (forma dopełniacza, „pół łyżki" = forma jak dla wielu).

## 5. Struktura folderów (Next.js App Router)

```
app/
  page.tsx                        → root: auto-anonymous + redirect do /recipes
  (auth)/
    register/page.tsx             → konwersja anon → email (link account)
    login/page.tsx                → dla powracających userów
  (app)/
    recipes/
      page.tsx                    → lista przepisów
      new/page.tsx                → wybór: skan/upload LUB pusty formularz
      [id]/page.tsx               → podgląd
      [id]/edit/page.tsx          → edycja
    layout.tsx                    → wrapper z nawigacją + baner „Załóż konto”
  api/
    parse-recipe/route.ts         → endpoint wywołujący Claude
components/
  RecipeForm.tsx                  → współdzielony formularz (new/edit/po-skanowaniu)
  RecipeCard.tsx                  → kafelek na liście
  IngredientsArray.tsx            → useFieldArray
  StepsArray.tsx                  → useFieldArray
  ScanButton.tsx                  → input z capture (mobile) + dropzone (desktop)
  AnonymousBanner.tsx             → „Twoje przepisy znikną za X dni — załóż konto”
  ui/                             → komponenty shadcn
lib/
  supabase/
    client.ts                     → client-side (browser)
    server.ts                     → server-side (Server Components, Route Handlers)
    middleware.ts                 → odświeżanie sesji
  schemas/recipe.ts               → Zod
  units.ts                        → słownik jednostek + formatIngredient (pluralizacja PL)
  ai/parse-recipe.ts              → logika wywołania Claude
  seed/recipes.ts                 → dane przykładowych przepisów
middleware.ts                     → auto-anonymous sign-in dla nowych userów
supabase/
  migrations/                     → SQL migracje
  functions/cleanup-anonymous/    → Edge Function do cleanupa
e2e/
  recipe-flow.spec.ts             → test: anonymous → seed → skan → zapis
.github/workflows/
  ci.yml                          → lint + typecheck + e2e
```

## 6. Flow „pierwsze wejście”

1. User wchodzi na `/`.
2. Middleware sprawdza sesję — brak. Wywołuje `supabase.auth.signInAnonymously()`.
3. Po stworzeniu konta serwer seeduje 2-3 przepisy z `lib/seed/recipes.ts` do `recipes` z `is_seed = true` i `user_id = nowy.id`.
4. Redirect na `/recipes` — user widzi listę z 3 przepisami i może klikać.
5. Subtelny baner na górze: **„Korzystasz w trybie gościa. Załóż konto żeby zachować przepisy.”** + przycisk **„Załóż konto”**.

## 7. Flow „skanuj zdjęcie”

1. User klika **Dodaj przepis ze zdjęcia** → `ScanButton`.
2. Na mobile otwiera się aparat (`<input type="file" accept="image/*" capture="environment">`), na desktopie picker plików + drag&drop.
3. Plik (jako FormData) leci do `POST /api/parse-recipe`.
4. Route handler:
   - waliduje rozmiar/typ pliku,
   - woła Claude API z promptem „przeczytaj ten przepis i zwróć JSON zgodny ze schematem” + obrazem,
   - parsuje odpowiedź przez `RecipeSchema.safeParse`,
   - zwraca JSON do klienta.
5. Klient ustawia wynik jako `defaultValues` w `RecipeForm`.
6. User edytuje, klika **Zapisz** → mutacja TanStack Query → insert w Supabase.

**Fallback:** jeśli AI zwróci coś nieprawidłowego — pusty formularz + toast „Nie udało się odczytać, wypełnij ręcznie”.

## 8. Flow „załóż konto” (link anonymous → email)

1. Anonimowy user klika **Załóż konto** w banerze.
2. Formularz: email + hasło.
3. Wywołanie `supabase.auth.updateUser({ email, password })` na anonimowym koncie → konto staje się normalne, zachowuje to samo `user.id`.
4. Update `profiles.is_anonymous = false`, `profiles.email = …`.
5. Wszystkie przepisy zostają (mają to samo `user_id`).
6. Baner znika, user jest pełnoprawnym kontem.

## 9. Etapy implementacji

### Etap 1 — fundament (½–1 dzień)

- `npx create-next-app@latest scan-and-cook --typescript --tailwind --app`
- Inicjalizacja shadcn/ui (`npx shadcn@latest init`)
- Repo na GitHubie, deploy na Vercel (placeholder)
- Konfiguracja ESLint, Prettier
- **GitHub Actions: workflow `ci.yml` (lint + typecheck)** — od początku, żeby pipeline rósł razem z projektem

### Etap 2 — Supabase + anonymous auth (1 dzień)

- Projekt w Supabase (region Frankfurt)
- Włączenie Anonymous Sign-ins (Settings → Authentication → Providers)
- Migracja: tabele `profiles`, `recipes`, RLS, trigger `on auth.users insert → profiles insert`
- Instalacja `@supabase/ssr`, konfiguracja klientów
- `middleware.ts`: jeśli brak sesji → `signInAnonymously()` + seed przepisów
- `lib/seed/recipes.ts` — 2-3 przepisy mamy (np. „Zupa pomidorowa”, „Sernik”, „Pierogi ruskie”)

### Etap 3 — CRUD bez AI (1–2 dni)

- `RecipeForm` (React Hook Form + Zod) z `useFieldArray` dla składników i kroków
- Strona `/recipes` — lista (Server Component)
- Strona `/recipes/new` — formularz ręczny → insert
- Strona `/recipes/[id]` — podgląd
- Strona `/recipes/[id]/edit` — `RecipeForm` z `defaultValues`
- Usuwanie z confirmation dialog
- `AnonymousBanner` z licznikiem dni do wyczyszczenia
- Strona `/register` — formularz upgradu anon → email
- Strona `/login` — dla powracających

### Etap 4 — skanowanie z AI (1 dzień)

- Konto Anthropic, klucz w `.env.local` i Vercel env vars
- `lib/ai/parse-recipe.ts` — wywołanie Claude z obrazem + Zod schema
- Route handler `/api/parse-recipe`
- `ScanButton` z input/dropzone
- Przełącznik **„Wpisz ręcznie / Zeskanuj zdjęcie”** na `/recipes/new`
- Loading state podczas parsowania

### Etap 5 — testy + cleanup (½–1 dzień)

- Playwright setup
- **E2E test 1:** wejście → widoczne 3 seedowe przepisy → kliknięcie podglądu → kliknięcie usunięcia
- **E2E test 2:** dodanie przepisu ręcznie → pojawia się na liście
- (Opcjonalnie) E2E test 3: scan flow z mockowanym Claude
- Supabase Edge Function `cleanup-anonymous` + scheduled trigger (cron)
- Rozszerzenie CI: dodaj Playwright do `ci.yml`

### Etap 6 — polish (½–1 dzień)

- Toast notifications (sonner)
- Loading states, skeleton screens
- Pusty stan listy (nie wystąpi dzięki seedowi, ale na wszelki wypadek)
- Prosta wyszukiwarka po tytule
- Responsive testy na mobile
- Favicon, meta tags, podstawowe SEO
- **README na GitHubie:** case study, architektura, decyzje techniczne, screeny, link do live demo, lessons learned
- Ustawienie nazwy projektu w Vercel (`scan-and-cook.vercel.app`) + wygenerowanie kodu QR z UTM do CV
- Vercel Analytics włączony (śledzenie wejść z UTM)

## 10. Portfolio boosters (włączone w planie)

- ✅ Anonymous Sign-ins + seed (zero progu wejścia)
- ✅ Solidny README z case study, architekturą i screenami
- ✅ E2E testy w Playwright (główny flow)
- ✅ CI w GitHub Actions (lint + typecheck + e2e)
- ✅ Kod QR na CV → live demo (z trackingiem UTM)
- ⏸ Dark mode + Framer Motion — nie w MVP, można dodać później

## 10a. Kod QR na CV

**Cel:** rekruter ogląda CV (papierowe lub PDF), skanuje QR telefonem, ląduje na działającej aplikacji w 2 sekundy.

**Co potrzebujemy:**

1. **Domena Vercel (free)** — w Vercel ustawiamy nazwę projektu jako `scan-and-cook`, dzięki czemu URL to `https://scan-and-cook.vercel.app` (zamiast losowego `scan-and-cook-abc123.vercel.app`). W przyszłości łatwo podpiąć własną domenę, jeśli zechcesz.
2. **UTM parameters** w URL do śledzenia: `https://scan-and-cook.vercel.app?utm_source=cv&utm_medium=qr&utm_campaign=rekrutacja_2026`. Możesz zrobić różne kody dla różnych firm/wersji CV (np. `utm_content=allegro` vs `utm_content=stxnext`) i zobaczyć skąd przyszli.
3. **Generator QR** — najlepiej wygenerować raz, lokalnie, wysokiej rozdzielczości (do CV i PDF):
   - Online: [qr-code-generator.com](https://www.qr-code-generator.com/), [qrcode-monkey.com](https://www.qrcode-monkey.com/) (pozwala dodać logo w środku)
   - Programowo: paczka `qrcode` w Node — możemy wygenerować w trakcie projektu jako część skryptu w repo
4. **Analytics** żeby zobaczyć wejścia — **Vercel Analytics** (free tier). UTM zostanie zarejestrowane automatycznie.
5. **Po skanowaniu QR** — rekruter ląduje od razu na `/` aplikacji, middleware tworzy mu anonymous session + seed, redirect na `/recipes`. Bez ekranu pośredniego. UTM zostaje w URL na potrzeby analytics, dla rekrutera flow jest „zeskanowałem → jestem w działającej aplikacji”.

**Co dodać do CV obok QR:**

Małą sekcję projektu z 2-3 liniami opisu (problem → rozwiązanie → tech) i linkami: live demo, GitHub. QR jest cherry on top, ale podstawowe linki też muszą być (rekruterzy często czytają cyfrowe CV).

**Etap implementacji:** dodać do Etapu 6 (polish):

- Ustawienie nazwy projektu w Vercel na `scan-and-cook` (URL: `scan-and-cook.vercel.app`)
- Wygenerowanie QR (1-2 warianty z różnymi UTM)
- Vercel Analytics włączony w dashboardzie
- Test czytelności QR (skan z odległości pół metra) przed drukiem CV

## 11. Co świadomie zostawiamy poza MVP

- Storage oryginalnego zdjęcia (`source_image_url`)
- Upload zdjęcia z galerii jako osobna ścieżka
- Kategorie i tagi
- Czas przygotowania, liczba porcji
- Wyszukiwanie po składnikach
- Udostępnianie przepisów / publiczne
- Eksport do PDF / drukowanie
- Lista zakupów, przeliczanie porcji
- PWA / tryb offline
- OAuth (Google), magic link
- Dark mode + animacje

## 12. Otwarte decyzje

- [ ] Logo / kolory (Tailwind theme)
- [ ] Język interfejsu — PL only czy EN? (nazwa jest angielska, może warto cały UI po angielsku?)
- [ ] Przykładowe przepisy do seeda (3 konkretne tytuły)

## 13. Zmienne środowiskowe (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # tylko server-side, NIGDY do klienta
ANTHROPIC_API_KEY=                  # tylko server-side
```

---

**Następny krok:** Etap 1 — inicjalizacja projektu Next.js + GitHub Actions CI. Daj znać, kiedy startujemy.
