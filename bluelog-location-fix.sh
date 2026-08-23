#!/usr/bin/env bash
set -euo pipefail
cd "${1:-$(pwd)}"
test -f package.json || { echo "Voer dit uit in /workspaces/BlueLog"; exit 1; }

cat > components/diveform/GeneralSection.tsx <<'EOF'
"use client";

import { useEffect, useMemo, useState } from "react";
import { Dive } from "@/server/types/dive";
import { Buddy } from "@/lib/buddyApi";
import { DiveSite, getDiveSites } from "@/lib/diveSiteApi";

type Props = {
  form: Dive;
  buddies: Buddy[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onLocationSelect: (site: DiveSite) => void;
};

export default function GeneralSection({
  form,
  buddies,
  onChange,
  onLocationSelect,
}: Props) {
  const [diveSites, setDiveSites] = useState<DiveSite[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [siteError, setSiteError] = useState("");

  useEffect(() => {
    let active = true;

    getDiveSites()
      .then((sites) => {
        if (active) {
          setDiveSites(sites);
          setSiteError("");
        }
      })
      .catch((error) => {
        console.error(error);
        if (active) {
          setSiteError("Duiklocaties konden niet worden geladen.");
        }
      })
      .finally(() => {
        if (active) setLoadingSites(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedSiteId = useMemo(() => {
    const match = diveSites.find(
      (site) =>
        site.name === form.location &&
        site.country === form.country
    );
    return match?.id ?? "";
  }, [diveSites, form.location, form.country]);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Algemene gegevens</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block">Duiknummer</label>
          <input
            type="number"
            name="diveNumber"
            value={form.diveNumber}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">Datum</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-semibold">Bekende duikstek</label>
          <select
            value={selectedSiteId}
            disabled={loadingSites}
            onChange={(e) => {
              const site = diveSites.find(
                (item) => item.id === e.target.value
              );
              if (site) onLocationSelect(site);
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">
              {loadingSites
                ? "Duiklocaties laden..."
                : "Kies een duiklocatie uit Nederland of Curaçao"}
            </option>
            {diveSites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} — {site.region}, {site.country}
              </option>
            ))}
          </select>

          {siteError && (
            <p className="mt-2 text-sm text-amber-400">
              {siteError} Je kunt hieronder nog steeds zelf een locatie invullen
              en de pin op de kaart zetten.
            </p>
          )}

          <p className="mt-2 text-sm text-slate-400">
            Kies een bekende stek, gebruik GPS als je er nu bent, of vul hieronder
            zelf een naam in en wijs de locatie aan op de satellietkaart.
          </p>
        </div>

        <div>
          <label className="mb-2 block">Duikstek / eigen locatienaam</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Bijv. Zeelandbrug of Eigen stek"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">Land</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={onChange}
            placeholder="Nederland"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">Buddy</label>
          <select
            name="buddy"
            value={form.buddy}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">Kies een buddy</option>
            {buddies.map((buddy) => (
              <option
                key={buddy.id}
                value={`${buddy.firstName} ${buddy.lastName}`}
              >
                {buddy.firstName} {buddy.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block">Type duik</label>
          <select
            name="diveType"
            value={form.diveType}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="Boot">Boot</option>
            <option value="Kant">Kant</option>
          </select>
        </div>
      </div>
    </div>
  );
}

EOF

python3 - <<'PY'
from pathlib import Path
p = Path("components/DiveForm.tsx")
s = p.read_text()

old = "      location: site.name,\n      country: site.country,\n      latitude: site.latitude,\n      longitude: site.longitude,"
new = "      location: site.name,\n      country: site.country,\n      latitude: site.latitude,\n      longitude: site.longitude,\n      waterType:\n        site.waterType === \"Zoet\" || site.waterType === \"Zout\"\n          ? site.waterType\n          : prev.waterType,\n      diveType:\n        site.entryType === \"Kant\" || site.entryType === \"Boot\"\n          ? site.entryType\n          : prev.diveType,"
if old in s:
    s = s.replace(old, new)

old_gps = "          ...prev,\n          latitude: Number("
new_gps = "          ...prev,\n          location: prev.location || \"GPS locatie\",\n          latitude: Number("
if old_gps in s:
    s = s.replace(old_gps, new_gps, 1)

p.write_text(s)
PY

npm run build

echo
echo "KLAAR."
echo "Daarna committen/pushen met:"
echo "git add components/diveform/GeneralSection.tsx components/DiveForm.tsx"
echo "git commit -m 'Add flexible dive location selection'"
echo "git push"
