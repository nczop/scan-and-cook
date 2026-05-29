-- Źródło dodania przepisu (badge: ręcznie vs skan).
alter table public.recipes
  add column if not exists entry_source text;

comment on column public.recipes.entry_source is
  'manual | scan — ustawiane przy insert; null = starsze wiersze (traktujemy jak manual w UI).';
