-- =====================================================================
-- Dr. Afrooz Purarjomand — Personal Brand Website
-- Initial schema: profiles, services, availability, bookings,
-- newsletter, contact messages.
-- Designed to scale to webinars and online courses later.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  company text,
  role text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: self read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: self upsert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text not null,
  duration_minutes int not null,
  price_cents int not null,
  currency text not null default 'USD',
  stripe_price_id text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "services: public read active"
  on public.services for select
  using (is_active = true);

-- ---------------------------------------------------------------------
-- availability_rules  (weekly recurring windows)
-- ---------------------------------------------------------------------
create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  timezone text not null default 'Australia/Brisbane',
  created_at timestamptz not null default now()
);

alter table public.availability_rules enable row level security;

create policy "availability_rules: public read"
  on public.availability_rules for select using (true);

-- ---------------------------------------------------------------------
-- availability_overrides  (one-off open/close days)
-- ---------------------------------------------------------------------
create table if not exists public.availability_overrides (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  is_available boolean not null,
  start_time time,
  end_time time,
  created_at timestamptz not null default now()
);

alter table public.availability_overrides enable row level security;

create policy "availability_overrides: public read"
  on public.availability_overrides for select using (true);

-- ---------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  service_id uuid not null references public.services (id),
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending','paid','confirmed','cancelled','completed')),
  stripe_session_id text,
  stripe_payment_intent text,
  google_event_id text,
  meet_link text,
  notes text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists bookings_slot_start_idx on public.bookings (slot_start);
create index if not exists bookings_user_idx on public.bookings (user_id);

alter table public.bookings enable row level security;

create policy "bookings: self read"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "bookings: self insert"
  on public.bookings for insert
  with check (auth.uid() = user_id);
-- Note: confirmation/writes from Stripe webhook use the service-role key,
-- which bypasses RLS.

-- ---------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'active' check (status in ('active','unsubscribed')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;
-- Writes happen via service-role key only; no public policies.

-- ---------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
-- Writes happen via service-role key only; no public policies.

-- ---------------------------------------------------------------------
-- Seed: launch services + a default weekday availability rule
-- ---------------------------------------------------------------------
insert into public.services
  (slug, name, tagline, description, duration_minutes, price_cents, currency, sort_order)
values
  ('discovery-call', 'Discovery Call',
   'Diagnose your AI opportunity in 30 minutes.',
   'A focused conversation to identify the highest-leverage AI initiatives in your organisation, surface hidden risks, and define what success looks like.',
   30, 15000, 'USD', 1),
  ('strategy-session', 'Strategy Session',
   'Build a research-grounded AI roadmap.',
   'A deep working session for leadership teams ready to translate AI ambition into a concrete, evidence-based roadmap aligned with business priorities.',
   60, 35000, 'USD', 2),
  ('deep-dive', 'Deep Dive',
   'Hands-on advisory for complex AI programmes.',
   'An extended engagement for enterprise and healthcare teams tackling large-scale GenAI or data science initiatives.',
   90, 60000, 'USD', 3)
on conflict (slug) do nothing;

-- Mon–Fri 09:00–17:00 Brisbane.
insert into public.availability_rules (day_of_week, start_time, end_time, timezone)
values
  (1, '09:00', '17:00', 'Australia/Brisbane'),
  (2, '09:00', '17:00', 'Australia/Brisbane'),
  (3, '09:00', '17:00', 'Australia/Brisbane'),
  (4, '09:00', '17:00', 'Australia/Brisbane'),
  (5, '09:00', '17:00', 'Australia/Brisbane')
on conflict do nothing;
