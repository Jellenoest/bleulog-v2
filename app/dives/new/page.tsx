"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Dive } from "@/server/types/dive";
import { getDives, saveDive } from "@/lib/storage";

import DiveForm from "@/components/dives/DiveForm";

export default function NewDivePage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [dive, setDive] = useState<Dive>(() => ({
    id: crypto.randomUUID(),

    diveNumber: 1,

    date: new Date().toISOString().split("T")[0],

    location: "",
    country: "",
    buddy: "",

    latitude: 0,
    longitude: 0,

    diveType: "Boot",

    nightDive: false,
    driftDive: false,
    altitudeDive: false,

    // Duik
    maxDepth: 0,
    averageDepth: 0,

    duration: 0,
    safetyStop: 0,

    // Water
    waterType: "Zoet",
    waterTemperature: 0,
    visibility: 0,
    current: "",

    // Materiaal
    weight: 0,

    suit: "",
    cylinder: "",
    gas: "Lucht",

    startPressure: 0,
    endPressure: 0,

    airConsumption: 0,

    // Notities
    notes: "",

    // Foto's
    photos: [],
  }));

  useEffect(() => {
    async function setNextDiveNumber() {
      try {
        const dives = await getDives();

        const highestDiveNumber =
          dives.length > 0
            ? Math.max(
                ...dives.map(
                  (item) => Number(item.diveNumber) || 0
                )
              )
            : 0;

        const nextDiveNumber = highestDiveNumber + 1;

        setDive((current) => ({
          ...current,
          diveNumber: nextDiveNumber,
        }));
      } catch (error) {
        console.error(
          "Kon volgend duiknummer niet bepalen:",
          error
        );

        setDive((current) => ({
          ...current,
          diveNumber:
            current.diveNumber > 0
              ? current.diveNumber
              : 1,
        }));
      }
    }

    setNextDiveNumber();
  }, []);

  async function handleSave() {
    try {
      setSaving(true);

      await saveDive(dive);

      router.push("/dives");
      router.refresh();
    } catch (error) {
      console.error("Opslaan van duik mislukt:", error);

      alert(
        "Opslaan mislukt. Controleer je verbinding en probeer opnieuw."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Nieuwe duik
          </h1>

          <p className="mt-2 text-slate-400">
            Vul de gegevens van je duik in.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-900 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
      </div>

      <DiveForm
        dive={dive}
        onChange={setDive}
      />

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-900 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dives")}
          disabled={saving}
          className="rounded-lg border border-slate-600 px-6 py-3 hover:bg-slate-800 disabled:opacity-50"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}