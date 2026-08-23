#!/usr/bin/env bash
set -euo pipefail
cd "${1:-$(pwd)}"

test -f package.json || { echo "Voer dit uit in /workspaces/BlueLog"; exit 1; }

echo "1/4 Eigenaarschap-SQL maken..."

cat > supabase/add-dive-owners.sql <<'EOF'
alter table public.dives
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Alle bestaande BlueLog-duiken worden aan Jellenoest gekoppeld.
update public.dives
set user_id = '79c5cc5b-e42b-4dd7-a2f0-93973f6e546a'
where user_id is null;

alter table public.dives
alter column user_id set not null;

create index if not exists dives_user_id_idx
on public.dives(user_id);

alter table public.dives enable row level security;

drop policy if exists "Users can read own dives" on public.dives;
drop policy if exists "Users can insert own dives" on public.dives;
drop policy if exists "Users can update own dives" on public.dives;
drop policy if exists "Users can delete own dives" on public.dives;

create policy "Users can read own dives"
on public.dives
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own dives"
on public.dives
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own dives"
on public.dives
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own dives"
on public.dives
for delete
to authenticated
using ((select auth.uid()) = user_id);
EOF

echo "2/4 /api/dives beveiligen per gebruiker..."

cat > app/api/dives/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabase/server";

function rowToDive(row: any) {
  return {
    ...(row.payload ?? {}),
    id: row.id,
    diveNumber: row.dive_number ?? row.payload?.diveNumber ?? 0,
    date: row.date ?? row.payload?.date ?? "",
    location: row.location ?? row.payload?.location ?? "",
    country: row.country ?? row.payload?.country ?? "",
    buddy: row.buddy ?? row.payload?.buddy ?? "",
    latitude: row.latitude ?? row.payload?.latitude ?? 0,
    longitude: row.longitude ?? row.payload?.longitude ?? 0,
  };
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("dives")
    .select("*")
    .eq("user_id", user.id)
    .order("dive_number", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    (data ?? []).map(rowToDive)
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  const dive = await request.json();

  let diveNumber = Number(dive.diveNumber) || 0;

  if (diveNumber <= 0) {
    const { data: lastDive, error: numberError } =
      await supabaseAdmin
        .from("dives")
        .select("dive_number")
        .eq("user_id", user.id)
        .order("dive_number", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (numberError) {
      return NextResponse.json(
        { error: numberError.message },
        { status: 500 }
      );
    }

    diveNumber =
      (Number(lastDive?.dive_number) || 0) + 1;
  }

  const payload = {
    ...dive,
    diveNumber,
  };

  const { error } = await supabaseAdmin
    .from("dives")
    .insert({
      id: dive.id,
      user_id: user.id,
      dive_number: diveNumber,
      date: dive.date || null,
      location: dive.location ?? "",
      country: dive.country ?? "",
      buddy: dive.buddy ?? "",
      latitude: dive.latitude || null,
      longitude: dive.longitude || null,
      payload,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
EOF

echo "3/4 /api/dives/[id] beveiligen per gebruiker..."

cat > app/api/dives/'[id]'/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabase/server";

function rowToDive(row: any) {
  return {
    ...(row.payload ?? {}),
    id: row.id,
    diveNumber: row.dive_number ?? row.payload?.diveNumber ?? 0,
    date: row.date ?? row.payload?.date ?? "",
    location: row.location ?? row.payload?.location ?? "",
    country: row.country ?? row.payload?.country ?? "",
    buddy: row.buddy ?? row.payload?.buddy ?? "",
    latitude: row.latitude ?? row.payload?.latitude ?? 0,
    longitude: row.longitude ?? row.payload?.longitude ?? 0,
  };
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("dives")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Duik niet gevonden." },
      { status: 404 }
    );
  }

  return NextResponse.json(rowToDive(data));
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const dive = await request.json();

  const payload = {
    ...dive,
    id,
  };

  const { data, error } = await supabaseAdmin
    .from("dives")
    .update({
      dive_number: dive.diveNumber ?? 0,
      date: dive.date || null,
      location: dive.location ?? "",
      country: dive.country ?? "",
      buddy: dive.buddy ?? "",
      latitude: dive.latitude || null,
      longitude: dive.longitude || null,
      payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Duik niet gevonden." },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 204 });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("dives")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Duik niet gevonden." },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
EOF

echo "4/4 Schema voor toekomstige installs bijwerken..."

python3 - <<'PY'
from pathlib import Path

p = Path("supabase/schema.sql")
s = p.read_text()

needle = "  id uuid primary key default gen_random_uuid(),\n  dive_number integer not null default 0,"
replacement = "  id uuid primary key default gen_random_uuid(),\n  user_id uuid not null references auth.users(id) on delete cascade,\n  dive_number integer not null default 0,"

if needle in s and "user_id uuid" not in s:
    s = s.replace(needle, replacement, 1)

if "dives_user_id_idx" not in s:
    marker = "create index if not exists dives_dive_number_idx"
    index_sql = "create index if not exists dives_user_id_idx on public.dives (user_id);\n\n"
    if marker in s:
        s = s.replace(marker, index_sql + marker, 1)

p.write_text(s)
PY

npm run build

echo
echo "KLAAR MET CODE."
echo
echo "BELANGRIJK: voer nu eerst supabase/add-dive-owners.sql uit in Supabase SQL Editor."
echo
echo "Daarna test je lokaal met beide accounts."
echo
echo "Als dat goed is push je:"
echo "git add app/api/dives/route.ts 'app/api/dives/[id]/route.ts' supabase/schema.sql supabase/add-dive-owners.sql"
echo "git commit -m 'Separate dives by user'"
echo "git push"
