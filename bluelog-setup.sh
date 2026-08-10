#!/usr/bin/env bash
set -euo pipefail
cd "${1:-$(pwd)}"

test -f package.json || { echo "Voer dit uit in /workspaces/BlueLog"; exit 1; }

echo "BlueLog setup starten..."

mkdir -p app/api/dives/'[id]' app/api/dive-sites/search app/api/buddies/'[id]' lib supabase

cat > lib/supabaseAdmin.ts <<'EOF'
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY ontbreken.");
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
EOF

cat > app/api/dives/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const toDive = (row: any) => ({
  ...(row.payload ?? {}),
  id: row.id,
  diveNumber: row.dive_number ?? 0,
  date: row.date ?? "",
  location: row.location ?? "",
  country: row.country ?? "",
  buddy: row.buddy ?? "",
  latitude: row.latitude ?? 0,
  longitude: row.longitude ?? 0,
});

export async function GET() {
  const { data, error } = await supabaseAdmin.from("dives").select("*").order("dive_number", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(toDive));
}

export async function POST(request: Request) {
  const dive = await request.json();
  const { error } = await supabaseAdmin.from("dives").insert({
    id: dive.id,
    dive_number: dive.diveNumber ?? 0,
    date: dive.date || null,
    location: dive.location ?? "",
    country: dive.country ?? "",
    buddy: dive.buddy ?? "",
    latitude: dive.latitude || null,
    longitude: dive.longitude || null,
    payload: dive,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
EOF

cat > app/api/dives/'[id]'/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const toDive = (row: any) => ({
  ...(row.payload ?? {}),
  id: row.id,
  diveNumber: row.dive_number ?? 0,
  date: row.date ?? "",
  location: row.location ?? "",
  country: row.country ?? "",
  buddy: row.buddy ?? "",
  latitude: row.latitude ?? 0,
  longitude: row.longitude ?? 0,
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { data, error } = await supabaseAdmin.from("dives").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "Niet gevonden" }, { status: 404 });
  return NextResponse.json(toDive(data));
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const dive = await request.json();
  const { error } = await supabaseAdmin.from("dives").update({
    dive_number: dive.diveNumber ?? 0,
    date: dive.date || null,
    location: dive.location ?? "",
    country: dive.country ?? "",
    buddy: dive.buddy ?? "",
    latitude: dive.latitude || null,
    longitude: dive.longitude || null,
    payload: { ...dive, id },
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { error } = await supabaseAdmin.from("dives").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
EOF

cat > app/api/dive-sites/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("dive_sites").select("*").order("country").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((s) => ({
    id: s.id, code: s.code, name: s.name, country: s.country, countryCode: s.country_code,
    region: s.region, latitude: s.latitude, longitude: s.longitude, waterType: s.water_type,
    entryType: s.entry_type, difficulty: s.difficulty, maxDepth: s.max_depth, description: s.description,
  })));
}
EOF

cat > app/api/dive-sites/search/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().replace(/[%_,]/g, "");
  if (!q) return NextResponse.json([]);
  const { data, error } = await supabaseAdmin.from("dive_sites").select("*")
    .or(`name.ilike.%${q}%,region.ilike.%${q}%,country.ilike.%${q}%`).order("country").order("name").limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((s) => ({
    id: s.id, code: s.code, name: s.name, country: s.country, countryCode: s.country_code,
    region: s.region, latitude: s.latitude, longitude: s.longitude, waterType: s.water_type,
    entryType: s.entry_type, difficulty: s.difficulty, maxDepth: s.max_depth, description: s.description,
  })));
}
EOF

cat > app/api/buddies/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const fromRow = (r: any) => ({ ...(r.payload ?? {}), id: r.id });

export async function GET() {
  const { data, error } = await supabaseAdmin.from("buddies").select("*").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(fromRow));
}

export async function POST(request: Request) {
  const buddy = await request.json();
  const id = crypto.randomUUID();
  const { data, error } = await supabaseAdmin.from("buddies").insert({ id, payload: { ...buddy, id } }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(fromRow(data), { status: 201 });
}
EOF

cat > app/api/buddies/'[id]'/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const patch = await request.json();
  const { data: current, error: getError } = await supabaseAdmin.from("buddies").select("payload").eq("id", id).single();
  if (getError) return NextResponse.json({ error: getError.message }, { status: 404 });
  const payload = { ...(current?.payload ?? {}), ...patch, id };
  const { data, error } = await supabaseAdmin.from("buddies").update({ payload, updated_at: new Date().toISOString() }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...(data.payload ?? {}), id: data.id });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { error } = await supabaseAdmin.from("buddies").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
EOF

cat > supabase/schema.sql <<'EOF'
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
EOF

cat > supabase/seed-dive-sites.sql <<'EOF'
insert into public.dive_sites
(code,name,country,country_code,region,latitude,longitude,water_type,entry_type,difficulty,max_depth,description)
values
('NL-ZLD-001','Zeelandbrug','Nederland','NL','Zeeland',51.6407,3.9013,'Zout','Kant','Gemiddeld',35,'Oosterschelde'),
('NL-ZLD-002','Den Osse Haven','Nederland','NL','Zeeland',51.7467,3.8516,'Zout','Kant','Beginner',30,'Zeeland'),
('NL-ZLD-003','Dreischor Gemaal','Nederland','NL','Zeeland',51.6945,3.9785,'Zout','Kant','Gemiddeld',30,'Zeeland'),
('NL-VKP-001','Vinkeveense Plassen - Zandeiland 4','Nederland','NL','Utrecht',52.2496,4.9567,'Zoet','Kant','Beginner',22,'Vinkeveen'),
('NL-VKP-002','Vinkeveense Plassen - Zandeiland 9','Nederland','NL','Utrecht',52.2452,4.9648,'Zoet','Kant','Beginner',18,'Vinkeveen'),
('CW-001','Tugboat','Curaçao','CW','Caracasbaai',12.0729,-68.8614,'Zout','Kant','Beginner',18,'Curaçao'),
('CW-002','Playa Kalki','Curaçao','CW','Westpunt',12.3702,-69.1578,'Zout','Kant','Beginner',35,'Curaçao')
on conflict (code) do update set
name=excluded.name,country=excluded.country,country_code=excluded.country_code,region=excluded.region,
latitude=excluded.latitude,longitude=excluded.longitude,water_type=excluded.water_type,entry_type=excluded.entry_type,
difficulty=excluded.difficulty,max_depth=excluded.max_depth,description=excluded.description;
EOF

npm install @supabase/supabase-js
npm run build

echo
echo "KLAAR MET CODE."
echo "Nu alleen nog:"
echo "1. SQL uitvoeren in Supabase: supabase/schema.sql en supabase/seed-dive-sites.sql"
echo "2. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in Vercel zetten"
echo "3. git add . && git commit -m 'BlueLog Supabase' && git push"
