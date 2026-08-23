#!/usr/bin/env bash
set -euo pipefail
cd "${1:-$(pwd)}"

test -f package.json || { echo "Voer dit uit in /workspaces/BlueLog"; exit 1; }

echo "1/2 Duiknummer automatisch bepalen in nieuw-duik scherm..."

python3 - <<'PY'
from pathlib import Path

p = Path("app/dives/new/page.tsx")
s = p.read_text()

s = s.replace(
    'import { useState } from "react";',
    'import { useEffect, useState } from "react";'
)

s = s.replace(
    'import { saveDive } from "@/lib/storage";',
    'import { getDives, saveDive } from "@/lib/storage";'
)

needle = '  const [saving, setSaving] = useState(false);\n'
insert = '''  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function setNextDiveNumber() {
      try {
        const dives = await getDives();
        const nextDiveNumber =
          dives.length > 0
            ? Math.max(...dives.map((item) => Number(item.diveNumber) || 0)) + 1
            : 1;

        setDive((current) => ({
          ...current,
          diveNumber: nextDiveNumber,
        }));
      } catch (error) {
        console.error("Kon volgend duiknummer niet bepalen:", error);
        setDive((current) => ({
          ...current,
          diveNumber: current.diveNumber > 0 ? current.diveNumber : 1,
        }));
      }
    }

    setNextDiveNumber();
  }, []);
'''

if needle not in s:
    raise SystemExit("Kon saving-state in app/dives/new/page.tsx niet vinden.")

s = s.replace(needle, insert, 1)
s = s.replace('  diveNumber: 0,', '  diveNumber: 1,', 1)

p.write_text(s)
PY

echo "2/2 Server-side vangnet toevoegen..."

python3 - <<'PY'
from pathlib import Path

p = Path("app/api/dives/route.ts")
s = p.read_text()

old = '''export async function POST(request: Request) {
  const dive = await request.json();

  const { error } = await supabaseAdmin.from("dives").insert({
    id: dive.id,
    dive_number: dive.diveNumber ?? 0,
'''

new = '''export async function POST(request: Request) {
  const dive = await request.json();

  let diveNumber = Number(dive.diveNumber) || 0;

  if (diveNumber <= 0) {
    const { data: lastDive, error: numberError } = await supabaseAdmin
      .from("dives")
      .select("dive_number")
      .order("dive_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (numberError) {
      return NextResponse.json(
        { error: numberError.message },
        { status: 500 }
      );
    }

    diveNumber = (Number(lastDive?.dive_number) || 0) + 1;
  }

  const payload = {
    ...dive,
    diveNumber,
  };

  const { error } = await supabaseAdmin.from("dives").insert({
    id: dive.id,
    dive_number: diveNumber,
'''

if old not in s:
    raise SystemExit("Kon POST-blok in app/api/dives/route.ts niet vinden.")

s = s.replace(old, new, 1)
s = s.replace('    payload: dive,\n', '    payload,\n', 1)

p.write_text(s)
PY

npm run build

echo
echo "KLAAR."
echo "Push daarna met:"
echo "git add app/dives/new/page.tsx app/api/dives/route.ts"
echo "git commit -m 'Fix automatic dive numbering'"
echo "git push"
