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

export default function DiveSection({
  form,
  onChange,
}: Props) {
  return (
    <div>

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
            name="maxDepth"
            value={form.maxDepth}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Gemiddelde diepte (m)
          </label>

          <input
            type="number"
            name="averageDepth"
            value={form.averageDepth}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Duiktijd (min)
          </label>

          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Safety stop (min)
          </label>

          <input
            type="number"
            name="safetyStop"
            value={form.safetyStop}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Watersoort
          </label>

          <select
            name="waterType"
            value={form.waterType}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="Zoet">
              Zoet
            </option>

            <option value="Zout">
              Zout
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block">
            Temperatuur (°C)
          </label>

          <input
            type="number"
            name="waterTemperature"
            value={form.waterTemperature}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Zicht (m)
          </label>

          <input
            type="number"
            name="visibility"
            value={form.visibility}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Stroming
          </label>

          <input
            type="text"
            name="current"
            value={form.current}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="nightDive"
            checked={form.nightDive}
            onChange={onChange}
          />
          Nachtduik
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="driftDive"
            checked={form.driftDive}
            onChange={onChange}
          />
          Stromingsduik
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="altitudeDive"
            checked={form.altitudeDive}
            onChange={onChange}
          />
          Hoogteduik
        </label>

      </div>

    </div>
  );
}