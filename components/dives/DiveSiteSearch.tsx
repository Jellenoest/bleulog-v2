"use client";

import { useEffect, useState } from "react";

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
  const [results, setResults] = useState<DiveSite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/dive-sites/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          setResults([]);
          return;
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Zoek een bekende duikstek..."
        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
      />

      {loading && (
        <p className="mt-2 text-sm text-slate-400">
          Zoeken...
        </p>
      )}

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-xl">

          {results.map((site) => (
            <button
              key={site.id}
              type="button"
              onClick={() => {
                onSelect(site);
                setQuery(site.name);
                setResults([]);
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
          ))}

        </div>
      )}

    </div>
  );
}