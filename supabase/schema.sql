create extension if not exists pgcrypto;

create table if not exists public.dives (
  id uuid primary key default gen_random_uuid(),
  dive_number integer not null default 0,
  date date,
  location text not null default '',
  country text not null default '',
  buddy text not null default '',
  latitude double precision,
  longitude double precision,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dive_sites (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  country text not null,
  country_code text not null,
  region text not null default '',
  latitude double precision not null,
  longitude double precision not null,
  water_type text not null default '',
  entry_type text not null default '',
  difficulty text not null default '',
  max_depth numeric not null default 0,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.buddies (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dives enable row level security;
alter table public.dive_sites enable row level security;
alter table public.buddies enable row level security;
