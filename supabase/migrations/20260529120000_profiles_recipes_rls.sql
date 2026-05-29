-- =============================================================================
-- Scan and Cook — profiles + recipes + RLS + trigger
-- (zsynchronizowane z wdrożeniem w Supabase)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- Auto-create profile when auth.users row is created
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_anonymous)
  values (
    new.id,
    new.email,
    coalesce(new.is_anonymous, true)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- recipes
-- -----------------------------------------------------------------------------
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  notes text,
  is_seed boolean not null default false,
  source_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index recipes_user_id_idx on public.recipes (user_id);

alter table public.recipes enable row level security;

create policy "recipes_select_own"
  on public.recipes
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "recipes_insert_own"
  on public.recipes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "recipes_update_own"
  on public.recipes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "recipes_delete_own"
  on public.recipes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- recipes.updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger recipes_set_updated_at
  before update on public.recipes
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- API: dostęp dla zalogowanej roli (RLS i tak filtruje wiersze)
-- -----------------------------------------------------------------------------
grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.recipes to authenticated;
