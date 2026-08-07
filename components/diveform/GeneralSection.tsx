"use client";

import { Dive } from "@/server/types/dive";
import { Buddy } from "@/lib/buddyApi";
import { DiveSite } from "@/lib/diveSiteApi";
import DiveSiteSearch from "@/components/location/DiveSiteSearch";

type Props = {
  form: Dive;
  buddies: Buddy[];

  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => void;

  onLocationSelect: (
    site: DiveSite
  ) => void;
};

export default function GeneralSection({
  form,
  buddies,
  onChange,
  onLocationSelect,
}: Props) {
  return (
    <div>

      <h2 className="mb-6 text-2xl font-bold">
        Algemene gegevens
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block">
            Duiknummer
          </label>

          <input
            type="number"
            name="diveNumber"
            value={form.diveNumber}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Datum
          </label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Locatie
          </label>

          <DiveSiteSearch
            value={form.location}
            onSelect={onLocationSelect}
          />
        </div>

        <div>
          <label className="mb-2 block">
            Land
          </label>

          <input
            type="text"
            name="country"
            value={form.country}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Buddy
          </label>

          <select
            name="buddy"
            value={form.buddy}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">
              Kies een buddy
            </option>

            {buddies.map((buddy) => (
              <option
                key={buddy.id}
                value={`${buddy.firstName} ${buddy.lastName}`}
              >
                {buddy.firstName} {buddy.lastName}
              </option>
            ))}

          </select>

        </div>

        <div>
          <label className="mb-2 block">
            Type duik
          </label>

          <select
            name="diveType"
            value={form.diveType}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="Boot">
              Boot
            </option>

            <option value="Kant">
              Kant
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}