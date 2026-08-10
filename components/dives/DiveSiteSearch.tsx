"use client";

import { useEffect, useMemo, useState } from "react";

export type DiveSite = {
  id: string;
  code: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  waterType: string;
  entryType: string;
  difficulty: string;
  maxDepth: number;
  description: string;
};

type Props = {
  value: string;
  onSelect: (site: DiveSite) => void;
};

export default function DiveSiteSearch({
  value,
  onSelect,
}: Props) {
  const [query, setQuery] = useState(value);
  const [sites, setSites] = useState<DiveSite[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    let active = true;

    async function loadSites() {
      try {
        setLoading(true);
        const response = await fetch("/api/dive-sites", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: DiveSite[] = await response.json();

        if (active) {
          setSites(data);
          setError("");
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Duikstekken konden niet worden geladen.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSites();

    return () => {
      active = false;
    };
  }, []);

  const filteredSites = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (q.length < 3) return [];

    return sites.filter((site) =>
      [
        site.name,
        site.region,
        site.country,
        site.code,
      ].some((text) =>
        String(text ?? "").toLowerCase().includes(q)
      )
    );
  }, [query, sites]);

  return (
    <div className="relative w-full">
      <input
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        placeholder="Zoek of kies een bekende duikstek..."
        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
      />

      {loading && (
        <p className="mt-2 text-sm text-slate-400">
          Duikstekken laden...
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-amber-400">
          {error}
        </p>
      )}

      {!loading && !error && query.trim().length > 0 && query.trim().length < 3 && (
        <p className="mt-2 text-sm text-slate-400">
          Typ minimaal 3 letters om een bekende duikstek te zoeken.
        </p>
      )}

      {open && !loading && query.trim().length >= 3 && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
          {filteredSites.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400">
              Geen bekende duikstek gevonden. Je kunt de naam zelf invullen en
              de locatie op de kaart aanwijzen.
            </div>
          ) : (
            filteredSites.map((site) => (
              <button
                key={site.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(site);
                  setQuery(site.name);
                  setOpen(false);
                }}
                className="block w-full border-b border-slate-800 px-4 py-3 text-left hover:bg-slate-800"
              >
                <div className="font-semibold">
                  {site.name}
                </div>
                <div className="text-sm text-slate-400">
                  {site.region} • {site.country}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
