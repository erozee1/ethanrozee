-- QR platform schema: run this once in the new Supabase project's SQL editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)

create table if not exists public.codes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  destination_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null references public.codes(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  user_agent text,
  referrer text
);

create index if not exists scans_code_id_idx on public.scans (code_id);

-- Row Level Security: enabled with no policies, i.e. deny-all for the
-- anon/authenticated roles. The app is single-admin and only ever talks to
-- these tables from server-side Route Handlers using the secret key,
-- which bypasses RLS. Nothing here is ever queried from the browser.
alter table public.codes enable row level security;
alter table public.scans enable row level security;
