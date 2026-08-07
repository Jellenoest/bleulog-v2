"use client";

import { Dive } from "@/server/types/dive";

type Props = {
  dive: Dive;
  onChange: (dive: Dive) => void;
};

export default function EquipmentSection({
  dive,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold">
        Materiaal
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block">
            Lood (kg)
          </label>

          <input
            type="number"
            value={dive.weight}
            onChange={(e) =>
              onChange({
                ...dive,
                weight: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Pak
          </label>

          <input
            value={dive.suit}
            onChange={(e) =>
              onChange({
                ...dive,
                suit: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Fles
          </label>

          <input
            value={dive.cylinder}
            onChange={(e) =>
              onChange({
                ...dive,
                cylinder: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Gas
          </label>

          <input
            value={dive.gas}
            onChange={(e) =>
              onChange({
                ...dive,
                gas: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Begindruk (bar)
          </label>

          <input
            type="number"
            value={dive.startPressure}
            onChange={(e) =>
              onChange({
                ...dive,
                startPressure: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Einddruk (bar)
          </label>

          <input
            type="number"
            value={dive.endPressure}
            onChange={(e) =>
              onChange({
                ...dive,
                endPressure: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block">
            Luchtverbruik (SAC)
          </label>

          <input
            type="number"
            value={dive.airConsumption}
            onChange={(e) =>
              onChange({
                ...dive,
                airConsumption: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

      </div>

    </div>
  );
}