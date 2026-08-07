"use client";

import { useEffect, useState } from "react";
import {
  DiveSite,
  searchDiveSites,
} from "@/lib/diveSiteApi";

type Props = {
  value: string;
  onSelect: (site: DiveSite) => void;
};

export default function DiveSiteSearch({
  value,
  onSelect,
}: Props) {

  const [query, setQuery] =
    useState(value);

  const [results, setResults] =
    useState<DiveSite[]>([]);

  useEffect(() => {

    const timer = setTimeout(async () => {

      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {

        const data =
          await searchDiveSites(query);

        setResults(data);

      } catch (error) {

        console.error(error);

      }

    }, 300);

    return () => clearTimeout(timer);

  }, [query]);

  return (

    <div className="relative">

      <input
        type="text"
        value={query}
        placeholder="Zoek een duiklocatie..."
        onChange={(e) =>
          setQuery(e.target.value)
        }
        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
      />

      {results.length > 0 && (

        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

          {results.map((site) => (

            <button
              key={site.id}
              type="button"
              onClick={() => {

                setQuery(site.name);
                setResults([]);

                onSelect(site);

              }}
              className="block w-full border-b border-slate-800 px-4 py-3 text-left hover:bg-slate-800"
            >

              <div className="font-semibold">
                {site.name}
              </div>

              <div className="text-sm text-slate-400">
                {site.country}
              </div>

            </button>

          ))}

        </div>

      )}

    </div>

  );

}