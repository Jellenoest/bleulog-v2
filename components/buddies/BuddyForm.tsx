"use client";

import { Buddy } from "@/lib/buddyApi";

type Props = {
  buddy: Omit<Buddy, "id">;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => void;
  onSubmit: () => void;
};

export default function BuddyForm({
  buddy,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold">
        Nieuwe buddy
      </h2>

      <div className="grid gap-4 md:grid-cols-2">

        <input
          name="firstName"
          placeholder="Voornaam"
          value={buddy.firstName}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <input
          name="lastName"
          placeholder="Achternaam"
          value={buddy.lastName}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <input
          name="nickName"
          placeholder="Bijnaam"
          value={buddy.nickName}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <input
          type="date"
          name="birthDate"
          value={buddy.birthDate}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <input
          name="phone"
          placeholder="Telefoon"
          value={buddy.phone}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <input
          name="email"
          placeholder="E-mailadres"
          value={buddy.email}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <select
          name="certificationAgency"
          value={buddy.certificationAgency}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Brevetorganisatie</option>
          <option>PADI</option>
          <option>SSI</option>
          <option>NOB</option>
          <option>CMAS</option>
          <option>RAID</option>
          <option>SDI</option>
          <option>NAUI</option>
          <option>Overig</option>
        </select>

        <select
          name="certificationLevel"
          value={buddy.certificationLevel}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Brevetniveau</option>
          <option>Open Water</option>
          <option>Advanced Open Water</option>
          <option>Rescue Diver</option>
          <option>Divemaster</option>
          <option>Instructor</option>
        </select>

        <input
          type="number"
          name="totalDives"
          placeholder="Aantal duiken"
          value={buddy.totalDives}
          onChange={onChange}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <label className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800 p-3">
          <input
            type="checkbox"
            name="nitrox"
            checked={buddy.nitrox}
            onChange={onChange}
          />
          Nitrox gecertificeerd
        </label>

      </div>

      <textarea
        name="notes"
        placeholder="Notities"
        value={buddy.notes}
        onChange={onChange}
        rows={5}
        className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
      />

      <button
        type="button"
        onClick={onSubmit}
        className="mt-6 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
      >
        Buddy opslaan
      </button>

    </div>
  );
}