"use client";

import { Dive } from "@/server/types/dive";

type Props = {
  dive: Dive;
  onChange: (dive: Dive) => void;
};

export default function DiveOptionsSection({
  dive,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold">
        Duikopties
      </h2>

      <div className="grid gap-4 md:grid-cols-3">

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={dive.nightDive}
            onChange={(e) =>
              onChange({
                ...dive,
                nightDive: e.target.checked,
              })
            }
          />

          Nachtduik

        </label>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={dive.driftDive}
            onChange={(e) =>
              onChange({
                ...dive,
                driftDive: e.target.checked,
              })
            }
          />

          Driftduik

        </label>
                <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={dive.altitudeDive}
            onChange={(e) =>
              onChange({
                ...dive,
                altitudeDive: e.target.checked,
              })
            }
          />

          Hoogteduik

        </label>

      </div>

    </div>
  );
}