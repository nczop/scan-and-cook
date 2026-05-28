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

| Warstwa               | Wybór                                                                          | Uzasadnienie                                                                         |
| --------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Framework             | **Next.js 15 (App Router) + TypeScript**                                       | Server Components, Route Handlers (ukryty klucz Claude API), gotowy deploy na Vercel |
| Styling               | **Tailwind CSS + shadcn/ui**                                                   | Szybkie, profesjonalnie wyglądające komponenty                                       |
| Formularze            | **React Hook Form**                                                            | Lider w ekosystemie React, `useFieldArray` do składników i kroków                    |
| Walidacja             | **Zod**                                                                        | Jeden schemat → formularz + odpowiedź AI + typy TypeScript                           |
| Data fetching         | **TanStack Query** (mutacje, listy z filtrami) + Server Components (szczegóły) | Cache, optymistyczne aktualizacje                                                    |
| Baza + Auth + Storage | **Supabase** (region `eu-central-1` Frankfurt)                                 | Darmowy tier, gotowe RLS, Storage na zdjęcia                                         |
| AI                    | **Claude API (Anthropic)**                                                     | Structured output, świetnie czyta pismo odręczne, dobry polski                       |
| Hosting               | **Vercel**                                                                     | Idealna integracja z Next.js, free tier                                              |
| Testy E2E             | **Playwright**                                                                 | Pokrycie głównego flow, dobrze wygląda w portfolio                                   |
| CI                    | **GitHub Actions**                                                             | Lint + typecheck + testy na każdy push                                               |

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
- `ingredients` (jsonb) — tablica obiektów `{ amount, unit, name }`
- `steps` (jsonb) — tablica stringów
- `notes` (text, nullable)
- `is_seed` (boolean, default false) — odróżnia przepisy demo od dodanych przez usera
- `source_image_url` (text, nullable) — _poza MVP_
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### RLS (Row Level Security)

Wszystkie operacje na `recipes` ograniczone przez `user_id = auth.uid()`. Insert wymaga zalogowanego usera (anonimowego lub nie — oba mają `auth.uid()`). Profile widoczne tylko dla właściciela.

### Cleanup anonimowych kont

Scheduled Edge Function w Supabase (cron co 24h): usuń wszystkich anonimowych userów (`is_anonymous = true`) starszych niż 7 dni wraz z ich przepisami (cascade). Zapobiega zaśmiecaniu bazy.

## 4. Schemat Zod (jedno źródło prawdy)

```ts
import { z } from "zod";

export const IngredientSchema = z.object({
  amount: z.number().nullable(),
  unit: z.string().nullable(),
  name: z.string().min(1),
});

export const RecipeSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  ingredients: z
    .array(IngredientSchema)
    .min(1, "Dodaj co najmniej jeden składnik"),
  steps: z.array(z.string().min(1)).min(1, "Dodaj co najmniej jeden krok"),
  notes: z.string().nullable(),
});

export type Recipe = z.infer<typeof RecipeSchema>;
```

Ten sam schemat jest używany przez:

1. `zodResolver` w React Hook Form (walidacja formularza),
2. walidację odpowiedzi z Claude (`RecipeSchema.safeParse(aiResponse)`),
3. typy TypeScript w całej aplikacji.

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
- Repo na GitHubie, deploy na Vercel (placeholder strony)
- Konfiguracja ESLint, Prettier
- `.env.local` z placeholderami

### Etap 2 — Supabase i auth (½ dnia)

- Projekt w Supabase (region Frankfurt)
- Migracja: tabele `profiles`, `recipes`, RLS policies
- Instalacja `@supabase/ssr`, konfiguracja klientów (client/server)
- `middleware.ts` chroniący `(app)/*`
- Strony `login`, `register`, `logout`
- Trigger SQL: po utworzeniu usera w `auth.users` → wstaw wiersz do `profiles`

### Etap 3 — CRUD bez AI (1–2 dni)

- `RecipeForm` (React Hook Form + Zod) z `useFieldArray` dla składników i kroków
- Strona `/recipes/new` — formularz ręczny → mutacja insert
- Strona `/recipes` — lista (Server Component fetchujący z Supabase)
- Strona `/recipes/[id]` — podgląd
- Strona `/recipes/[id]/edit` — ten sam `RecipeForm` z `defaultValues`
- Usuwanie z confirmation dialog

**Po tym etapie aplikacja już jest funkcjonalna — bez AI.**

### Etap 4 — skanowanie z AI (1 dzień)

- Konto Anthropic, klucz w `.env.local` i Vercel env vars
- `lib/ai/parse-recipe.ts` — funkcja wywołująca Claude z obrazem + Zod schema
- Route handler `/api/parse-recipe`
- `ScanButton` z input/dropzone
- Strona `/recipes/new` z przełącznikiem **„Wpisz ręcznie / Zeskanuj zdjęcie”**
- Loading state podczas parsowania (spinner z komunikatem „Claude czyta przepis…”)

### Etap 5 — polish (½–1 dzień)

- Toast notifications (sonner z shadcn) na sukces/błąd
- Loading states i skeleton screens
- Pusty stan listy („Nie masz jeszcze żadnych przepisów”)
- Prosta wyszukiwarka po tytule
- Responsive testy na mobile (zwłaszcza flow skanowania)
- Favicon, meta tags, podstawowe SEO

## 8. Co świadomie zostawiamy poza MVP

- Storage oryginalnego zdjęcia (`source_image_url`)
- Upload zdjęcia z galerii jako osobna ścieżka (na razie ten sam input)
- Kategorie i tagi przepisów
- Czas przygotowania, liczba porcji
- Wyszukiwanie po składnikach
- Udostępnianie przepisów / przepisy publiczne
- Eksport do PDF / drukowanie
- Lista zakupów
- Przeliczanie porcji
- Tryb offline / PWA z service workerem
- OAuth (Google), magic link

## 9. Wykorzystanie generatorów UI (Bolt / v0.dev)

| Etap                | Generator pomaga? | Komentarz                                                                      |
| ------------------- | ----------------- | ------------------------------------------------------------------------------ |
| 1 — fundament       | Nie               | Ręczny setup, kontrola nad strukturą                                           |
| 2 — Supabase + auth | Nie               | Bezpieczeństwo, RLS — robimy świadomie                                         |
| 3 — CRUD            | **Tak (v0.dev)**  | Generuj `RecipeCard`, layout listy, układ formularza — wklej i podepnij logikę |
| 4 — AI              | Nie               | Specyficzna integracja Claude, lepiej ręcznie                                  |
| 5 — polish          | **Tak (v0.dev)**  | Puste stany, loading skeletons, toasty                                         |

Zasada: generatory traktujemy jak punkt wyjścia, nie gotowy produkt. Czytamy, czyścimy, dopasowujemy do swoich konwencji.

## 10. Otwarte decyzje

- [ ] Ostateczna nazwa aplikacji
- [ ] Logo / kolory (Tailwind theme)
- [ ] Czy w MVP zapisujemy oryginał zdjęcia w Supabase Storage (rekomendacja: **nie**, dodać w v2)
- [ ] Język interfejsu — PL only czy PL/EN?

## 11. Zmienne środowiskowe (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # tylko dla server-side, NIGDY do klienta
ANTHROPIC_API_KEY=                  # tylko server-side
```

---

**Następny krok:** Etap 1 — inicjalizacja projektu Next.js. Daj znać, kiedy chcesz zaczynać.
