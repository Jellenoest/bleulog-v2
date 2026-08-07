"use client";

import { Dive } from "@/server/types/dive";

type Props = {
  dive: Dive;
  onChange: (dive: Dive) => void;
};

export default function DiveInfoSection({
  dive,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold">
        Duikgegevens
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block">
            Maximale diepte (m)
          </label>

          <input
            type="number"
            value={dive.maxDepth}
            onChange={(e) =>
              onChange({
                ...dive,
                maxDepth: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Gemiddelde diepte (m)
          </label>

          <input
            type="number"
            value={dive.averageDepth}
            onChange={(e) =>
              onChange({
                ...dive,
                averageDepth: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Duiktijd (minuten)
          </label>

          <input
            type="number"
            value={dive.duration}
            onChange={(e) =>
              onChange({
                ...dive,
                duration: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Veiligheidsstop (minuten)
          </label>

          <input
            type="number"
            value={dive.safetyStop}
            onChange={(e) =>
              onChange({
                ...dive,
                safetyStop: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Watertemperatuur (°C)
          </label>

          <input
            type="number"
            value={dive.waterTemperature}
            onChange={(e) =>
              onChange({
                ...dive,
                waterTemperature: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Zicht (meter)
          </label>

          <input
            type="number"
            value={dive.visibility}
            onChange={(e) =>
              onChange({
                ...dive,
                visibility: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block">
            Stroming
          </label>

          <input
            value={dive.current}
            onChange={(e) =>
              onChange({
                ...dive,
                current: e.target.value,
              })
            }
            placeholder="Bijvoorbeeld: Geen, Licht, Sterk"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

      </div>

    </div>
  );
}