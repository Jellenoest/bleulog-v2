"use client";

import { Dive } from "@/server/types/dive";

type Props = {
  form: Dive;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => void;
};

export default function EquipmentSection({
  form,
  onChange,
}: Props) {
  return (
    <div>

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
            name="weight"
            value={form.weight}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Pak
          </label>

          <input
            type="text"
            name="suit"
            value={form.suit}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Fles
          </label>

          <input
            type="text"
            name="cylinder"
            value={form.cylinder}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Gas
          </label>

          <input
            type="text"
            name="gas"
            value={form.gas}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Begindruk (bar)
          </label>

          <input
            type="number"
            name="startPressure"
            value={form.startPressure}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Einddruk (bar)
          </label>

          <input
            type="number"
            name="endPressure"
            value={form.endPressure}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            SAC (luchtverbruik)
          </label>

          <input
            type="number"
            name="airConsumption"
            value={form.airConsumption}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

      </div>

    </div>
  );
}