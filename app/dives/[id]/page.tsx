"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Dive } from "@/server/types/dive";
import { getDive, deleteDive } from "@/lib/storage";

import DiveMap from "@/components/DiveMap";

export default function DiveDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dive, setDive] = useState<Dive | null>(null);

  useEffect(() => {
    loadDive();
  }, []);

  async function loadDive() {
    try {
      const data = await getDive(params.id as string);

      if (!data) {
        alert("Duik niet gevonden.");
        router.push("/dives");
        return;
      }

      setDive(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function removeDive() {
    if (!dive) return;

    if (!confirm("Weet je zeker dat je deze duik wilt verwijderen?")) {
      return;
    }

    await deleteDive(dive.id);
    router.push("/dives");
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        Laden...
      </div>
    );
  }

  if (!dive) return null;

  return (
    <main className="mx-auto max-w-6xl p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            🤿 Duik #{dive.diveNumber}
          </h1>

          <p className="mt-2 text-slate-400">
            {dive.location} • {dive.country}
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href={`/dives/edit/${dive.id}`}
            className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-900"
          >
            Bewerken
          </Link>

          <button
            onClick={removeDive}
            className="rounded-lg bg-red-600 px-5 py-3 text-white"
          >
            Verwijderen
          </button>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

          <h2 className="mb-5 text-2xl font-bold">
            Gegevens
          </h2>

          <p><strong>Datum:</strong> {dive.date}</p>
          <p><strong>Buddy:</strong> {dive.buddy}</p>
          <p><strong>Type:</strong> {dive.diveType}</p>
          <p><strong>Max diepte:</strong> {dive.maxDepth} m</p>
          <p><strong>Gem. diepte:</strong> {dive.averageDepth} m</p>
          <p><strong>Duiktijd:</strong> {dive.duration} min</p>
          <p><strong>Watertemperatuur:</strong> {dive.waterTemperature} °C</p>
          <p><strong>Water:</strong> {dive.waterType}</p>
          <p><strong>Gas:</strong> {dive.gas}</p>

        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

          <h2 className="mb-5 text-2xl font-bold">
            Kaart
          </h2>

          <DiveMap
            dives={[dive]}
            height="350px"
            title=""
          />

        </div>

      </div>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">

        <h2 className="mb-4 text-2xl font-bold">
          Notities
        </h2>

        <p className="whitespace-pre-wrap">
          {dive.notes || "Geen notities."}
        </p>

      </div>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">

        <h2 className="mb-4 text-2xl font-bold">
          Foto's
        </h2>

        {dive.photos.length === 0 ? (
          <p className="text-slate-400">
            Geen foto's toegevoegd.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {dive.photos.map((photo) => (

              <img
                key={photo}
                src={photo}
                className="rounded-xl"
                alt=""
              />

            ))}

          </div>
        )}

      </div>

    </main>
  );
}