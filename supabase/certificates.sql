create extension if not exists pgcrypto;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization text not null default '',
  certificate_name text not null default '',
  certificate_number text not null default '',
  achieved_date date,
  expiry_date date,
  notes text not null default '',
  image_url text not null default '',
  image_storage_path text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists certificates_user_id_idx
  on public.certificates(user_id);

alter table public.certificates enable row level security;

insert into storage.buckets (id, name, public)
values ('certificate-cards', 'certificate-cards', true)
on conflict (id) do update set public = true;
