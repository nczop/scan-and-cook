# Supabase — migracje, RLS, seed

## 1. Projekt i zmienne w Next.js

1. W [Supabase Dashboard](https://supabase.com/dashboard) utwórz projekt (region **Frankfurt `eu-central-1`**, zgodnie z planem).
2. **Settings → API**: skopiuj `Project URL` oraz `anon` / **Publishable** key.
3. W katalogu aplikacji utwórz `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_lub_publishable>
```

(Opcjonalnie zamiast `ANON_KEY` możesz użyć `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — obsługuje to `lib/supabase/env.ts`.)

## 2. Anonymous Sign-ins

**Authentication → Providers → Anonymous Users** — włącz.

Bez tego `signInAnonymously()` w middleware nie zadziała.

## 3. Uruchomienie migracji (schemat + RLS + trigger profilu)

Plik `migrations/20260529120000_profiles_recipes_rls.sql` jest **kopą wdrożonego schematu** (profiles z `is_anonymous default true`, `handle_new_user`, `set_updated_at` na `recipes`). **Nie uruchamiaj go ponownie** na projekcie, na którym tabele już istnieją — tylko na świeżym projekcie albo po ręcznym dostosowaniu (`if not exists` / migracja inkrementalna).

### Opcja A — SQL Editor (najszybsze na start)

1. **SQL Editor** w dashboardzie → **New query**.
2. Wklej zawartość pliku `migrations/20260529120000_profiles_recipes_rls.sql` z tego folderu.
3. **Run**. Sprawdź, czy nie ma błędów.

### Opcja B — Supabase CLI

```bash
pnpm dlx supabase link --project-ref <twój_ref>
pnpm dlx supabase db push
```

(Wymaga zalogowania CLI i połączonego projektu.)

## 4. Co robi migracja

| Element | Opis |
|--------|------|
| `public.profiles` | `id`, `email`, `display_name`, `is_anonymous` (domyślnie `true` w kolumnie), `created_at`. Trigger wstawia na start `id`, `email`, `is_anonymous` z `auth.users`. |
| Trigger `on_auth_user_created` | Po utworzeniu użytkownika (także anonymous) wstawia wiersz w `profiles`. |
| `public.recipes` | Przepisy: `user_id`, `title`, `ingredients` / `steps` jako **jsonb** (struktura jak w `lib/schemas/recipe.ts`), `notes`, `is_seed`, opcjonalnie `source_image_url`, kolumna `entry_source` (`manual` / `scan`, migracja `20260530120000_recipes_entry_source.sql`), znaczniki czasu. |
| Trigger `recipes_set_updated_at` | Przed `update` na `recipes` ustawia `updated_at`. |
| RLS | `profiles` i `recipes` — **authenticated** widzi i modyfikuje tylko własne dane (`auth.uid()`). |
| `grant … authenticated` | Jawne uprawnienia do `select`/`update` na `profiles` oraz pełny CRUD na `recipes` (RLS i tak filtruje). |

## 5. Seed przepisów (nie jest w SQL — celowo)

`user_id` musi być **Twoim** `auth.users.id` z sesji anonimowej, więc seed z planu realizuje się **z aplikacji** po zalogowaniu:

- Stałe dane: `lib/seed/recipes.ts` (`SEED_RECIPES`).
- Logika (kolejny krok w kodzie): przy pierwszym wejściu, jeśli użytkownik nie ma żadnego przepisu, `insert` kilku wierszy do `recipes` z `is_seed = true` i `user_id = session.user.id`.

Istniejący plik `lib/mocks/recipes.ts` możesz później zastąpić danymi z bazy albo importem z `lib/seed/recipes.ts`, żeby nie duplikować treści.

## 6. Weryfikacja w dashboardzie

Po wejściu na stronę aplikacji (middleware tworzy sesję):

- **Authentication → Users** — powinien pojawić się użytkownik (anonymous).
- **Table Editor → profiles** — jeden wiersz z `is_anonymous = true`.
- **Table Editor → recipes** — pusto, dopóki nie zaimplementujesz seeda w aplikacji.

## 7. Istniejący użytkownicy bez profilu

Migracja dodaje trigger tylko dla **nowych** insertów do `auth.users`. Jeśli testowałaś projekt przed migracją i masz userów bez `profiles`, możesz jednorazowo w SQL Editor:

```sql
insert into public.profiles (id, email, display_name, is_anonymous, created_at)
select u.id, u.email, u.raw_user_meta_data ->> 'display_name', coalesce(u.is_anonymous, true), now()
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
```

## 8. Service role

`SUPABASE_SERVICE_ROLE_KEY` (plan, `.env.local`) używaj **tylko** po stronie serwera (np. przyszłe joby, admin). Nie wkładaj go do kodu klienta ani do `NEXT_PUBLIC_*`.
