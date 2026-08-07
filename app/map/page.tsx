"use client";

import { useEffect, useState } from "react";

import DiveMap from "@/components/DiveMap";
import { Dive } from "@/server/types/dive";
import { getDives } from "@/lib/storage";

export default function MapPage() {
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDives() {
      try {
        const data = await getDives();
        setDives(data);
      } catch (error) {
        console.error("Kon duiken niet laden:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDives();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <h1 className="mb-6 text-3xl font-bold">
          🌍 Duikkaart
        </h1>

        <p>Kaart laden...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          🌍 Duikkaart
        </h1>

        <p className="mt-2 text-slate-400">
          Bekijk al je duiken op de wereldkaart.
        </p>
      </div>

      <DiveMap dives={dives} />

    </main>
  );
}