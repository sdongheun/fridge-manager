create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.fridges (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'My Fridge',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.food_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  fridge_id uuid not null references public.fridges (id) on delete cascade,
  name text not null,
  category text,
  quantity numeric(10, 2),
  unit text,
  storage_zone text check (storage_zone in ('fridge', 'freezer', 'pantry')),
  barcode text,
  purchase_date date,
  expiry_date date not null,
  memo text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists fridges_owner_user_id_key
  on public.fridges (owner_user_id);

create index if not exists food_items_user_id_expiry_date_idx
  on public.food_items (user_id, expiry_date);

create index if not exists food_items_fridge_id_expiry_date_idx
  on public.food_items (fridge_id, expiry_date);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  created_fridge_id uuid;
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name')
  on conflict (user_id) do nothing;

  insert into public.fridges (owner_user_id)
  values (new.id)
  on conflict (owner_user_id) do update
    set updated_at = timezone('utc', now())
  returning id into created_fridge_id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_fridges_updated_at on public.fridges;
create trigger set_fridges_updated_at
  before update on public.fridges
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_food_items_updated_at on public.food_items;
create trigger set_food_items_updated_at
  before update on public.food_items
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.fridges enable row level security;
alter table public.food_items enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = user_id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "fridges_select_own"
  on public.fridges
  for select
  using (auth.uid() = owner_user_id);

create policy "fridges_insert_own"
  on public.fridges
  for insert
  with check (auth.uid() = owner_user_id);

create policy "fridges_update_own"
  on public.fridges
  for update
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create policy "food_items_select_own"
  on public.food_items
  for select
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fridges
      where fridges.id = food_items.fridge_id
        and fridges.owner_user_id = auth.uid()
    )
  );

create policy "food_items_insert_own"
  on public.food_items
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fridges
      where fridges.id = food_items.fridge_id
        and fridges.owner_user_id = auth.uid()
    )
  );

create policy "food_items_update_own"
  on public.food_items
  for update
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fridges
      where fridges.id = food_items.fridge_id
        and fridges.owner_user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fridges
      where fridges.id = food_items.fridge_id
        and fridges.owner_user_id = auth.uid()
    )
  );

create policy "food_items_delete_own"
  on public.food_items
  for delete
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.fridges
      where fridges.id = food_items.fridge_id
        and fridges.owner_user_id = auth.uid()
    )
  );
