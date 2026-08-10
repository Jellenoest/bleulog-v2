"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Dive } from "@/server/types/dive";
import { getDives, deleteDive } from "@/lib/storage";

export default function DivesPage() {
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [buddyFilter, setBuddyFilter] = useState("Alle");
  const [countryFilter, setCountryFilter] = useState("Alle");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    loadDives();
  }, []);

  async function loadDives() {
    try {
      const data = await getDives();
      setDives(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function removeDive(id: string) {
    const confirmed = window.confirm(
      "Weet je zeker dat je deze duik wilt verwijderen?"
    );

    if (!confirmed) return;

    try {
      await deleteDive(id);
      await loadDives();
    } catch (error) {
      console.error(error);
      alert("Verwijderen mislukt.");
    }
  }


  function downloadFile(
    filename: string,
    content: string,
    type: string
  ) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const stamp = new Date().toISOString().slice(0, 10);

    downloadFile(
      `bluelog-backup-${stamp}.json`,
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          totalDives: dives.length,
          dives,
        },
        null,
        2
      ),
      "application/json"
    );
  }

  function csvValue(value: unknown) {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  }

  function exportCsv() {
    const headers = [
      "diveNumber",
      "date",
      "location",
      "country",
      "buddy",
      "latitude",
      "longitude",
      "diveType",
      "maxDepth",
      "averageDepth",
      "duration",
      "waterType",
      "waterTemperature",
      "visibility",
      "current",
      "weight",
      "suit",
      "cylinder",
      "gas",
      "startPressure",
      "endPressure",
      "airConsumption",
      "notes",
      "photos",
    ];

    const rows = dives.map((dive) =>
      headers
        .map((key) => {
          const record =
            dive as unknown as Record<string, unknown>;

          const value =
            key === "photos"
              ? Array.isArray(dive.photos)
                ? dive.photos.join(" | ")
                : ""
              : record[key];

          return csvValue(value);
        })
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const stamp = new Date().toISOString().slice(0, 10);

    downloadFile(
      `bluelog-duiken-${stamp}.csv`,
      "\uFEFF" + csv,
      "text/csv;charset=utf-8"
    );
  }

  const buddies = [
    "Alle",
    ...new Set(
      dives
        .map((d) => d.buddy)
        .filter(Boolean)
    ),
  ];

  const countries = [
    "Alle",
    ...new Set(
      dives
        .map((d) => d.country)
        .filter(Boolean)
    ),
  ];

  const totalDives = dives.length;

  const uniqueLocations = new Set(
    dives.map((d) => d.location)
  ).size;

  const uniqueBuddies = new Set(
    dives
      .map((d) => d.buddy)
      .filter(Boolean)
  ).size;

  const deepestDive =
    dives.length > 0
      ? Math.max(...dives.map((d) => d.maxDepth))
      : 0;

  const filteredDives = useMemo(() => {
    let result = [...dives];

    if (search.trim() !== "") {
      const q = search.toLowerCase();

      result = result.filter(
        (dive) =>
          dive.location.toLowerCase().includes(q) ||
          dive.country.toLowerCase().includes(q) ||
          dive.buddy.toLowerCase().includes(q)
      );
    }

    if (buddyFilter !== "Alle") {
      result = result.filter(
        (d) => d.buddy === buddyFilter
      );
    }

    if (countryFilter !== "Alle") {
      result = result.filter(
        (d) => d.country === countryFilter
      );
    }

    switch (sortBy) {
      case "depth":
        result.sort(
          (a, b) => b.maxDepth - a.maxDepth
        );
        break;

      case "duration":
        result.sort(
          (a, b) => b.duration - a.duration
        );
        break;

      default:
        result.sort((a, b) =>
          b.date.localeCompare(a.date)
        );
    }

    return result;
  }, [
    dives,
    search,
    buddyFilter,
    countryFilter,
    sortBy,
  ]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-20 text-center text-slate-400">
        Duiken laden...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Mijn Duiken
          </h1>

          <p className="mt-2 text-slate-400">
            {filteredDives.length} opgeslagen duiken
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={exportJson}
            className="rounded-lg border border-slate-600 px-4 py-3 font-semibold text-slate-200 hover:bg-slate-800"
          >
            Backup JSON
          </button>

          <button
            type="button"
            onClick={exportCsv}
            className="rounded-lg border border-slate-600 px-4 py-3 font-semibold text-slate-200 hover:bg-slate-800"
          >
            Export CSV
          </button>

          <Link
            href="/dives/new"
            className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-900 hover:bg-cyan-400"
          >
            + Nieuwe duik
          </Link>
        </div>

      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            🤿 Duiken
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {totalDives}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            🌍 Locaties
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {uniqueLocations}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            👤 Buddy's
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {uniqueBuddies}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            ⬇ Diepste duik
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {deepestDive} m
          </h2>
        </div>

      </div>
            <div className="mb-8 grid gap-4 lg:grid-cols-4">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoeken op locatie, buddy of land..."
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
        />

        <select
          value={buddyFilter}
          onChange={(e) => setBuddyFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
        >
          {buddies.map((buddy) => (
            <option key={buddy} value={buddy}>
              {buddy}
            </option>
          ))}
        </select>

        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
        >
          <option value="date">Nieuwste eerst</option>
          <option value="depth">Grootste diepte</option>
          <option value="duration">Langste duik</option>
        </select>

      </div>

      <div className="space-y-5">

        {filteredDives.length === 0 ? (

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
            Geen duiken gevonden.
          </div>

        ) : (

          filteredDives.map((dive) => (

            <div
              key={dive.id}
              className="rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-cyan-500"
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                <div className="flex-1">

                  <h2 className="text-2xl font-bold">
                    #{dive.diveNumber} • {dive.location}
                  </h2>

                  <p className="mt-1 text-slate-400">
                    🇳🇱 {dive.country}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">
                        👤 Buddy
                      </p>

                      <p className="font-semibold">
                        {dive.buddy || "-"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">
                        📅 Datum
                      </p>

                      <p className="font-semibold">
                        {dive.date}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">
                        ⬇ Maximale diepte
                      </p>

                      <p className="font-semibold">
                        {dive.maxDepth} meter
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">
                        ⏱ Duiktijd
                      </p>

                      <p className="font-semibold">
                        {dive.duration} minuten
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">
                        💧 Water
                      </p>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                          dive.waterType === "Zoet"
                            ? "bg-blue-600/20 text-blue-300"
                            : "bg-cyan-600/20 text-cyan-300"
                        }`}
                      >
                        {dive.waterType}
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">
                        🫧 Gas
                      </p>

                      <p className="font-semibold">
                        {dive.gas}
                      </p>
                    </div>

                  </div>

                </div>
                                <div className="flex flex-col justify-center gap-3">

                  <Link
                    href={`/dives/${dive.id}`}
                    className="rounded-lg bg-cyan-500 px-5 py-3 text-center font-semibold text-slate-900 transition hover:bg-cyan-400"
                  >
                    Openen
                  </Link>

                  <button
                    onClick={() => removeDive(dive.id)}
                    className="rounded-lg border border-red-500 px-5 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Verwijderen
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}