"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Dive } from "@/server/types/dive";
import DiveForm from "@/components/dives/DiveForm";

export default function EditDivePage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [dive, setDive] = useState<Dive | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadDive() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/dives/${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const text = await response.text();

          throw new Error(
            text || `API fout ${response.status}`
          );
        }

        const data: Dive = await response.json();

        setDive(data);
      } catch (error) {
        console.error("Duik laden mislukt:", error);

        setError(
          "De duik kon niet worden geladen."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDive();
  }, [id]);

  async function handleSave() {
    if (!dive) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/dives/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dive),
        }
      );

      if (!response.ok) {
        const text = await response.text();

        throw new Error(
          text || `API fout ${response.status}`
        );
      }

      router.push(`/dives/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Opslaan mislukt:", error);

      setError(
        "De wijzigingen konden niet worden opgeslagen."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-8">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
          Duik laden...
        </div>
      </main>
    );
  }

  if (error && !dive) {
    return (
      <main className="mx-auto max-w-6xl p-8">
        <div className="rounded-xl border border-red-700 bg-slate-900 p-8">
          <h1 className="text-2xl font-bold">
            Bewerken niet mogelijk
          </h1>

          <p className="mt-3 text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.push("/dives")}
            className="mt-6 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-900"
          >
            Terug naar mijn duiken
          </button>
        </div>
      </main>
    );
  }

  if (!dive) return null;

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Duik bewerken
          </h1>

          <p className="mt-2 text-slate-400">
            #{dive.diveNumber} • {dive.location}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-900 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Opslaan..."
              : "Wijzigingen opslaan"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(`/dives/${id}`)
            }
            disabled={saving}
            className="rounded-lg border border-slate-600 px-6 py-3 hover:bg-slate-800 disabled:opacity-50"
          >
            Annuleren
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/30 p-4 text-red-300">
          {error}
        </div>
      )}

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
          {saving
            ? "Opslaan..."
            : "Wijzigingen opslaan"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(`/dives/${id}`)
          }
          disabled={saving}
          className="rounded-lg border border-slate-600 px-6 py-3 hover:bg-slate-800 disabled:opacity-50"
        >
          Annuleren
        </button>
      </div>
    </main>
  );
}