"use client";

import { Dive } from "@/server/types/dive";

type Props = {
  form: Dive;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export default function NotesSection({
  form,
  onChange,
}: Props) {
  return (
    <div>

      <h2 className="mb-6 text-2xl font-bold">
        Notities
      </h2>

      <textarea
        name="notes"
        value={form.notes}
        onChange={onChange}
        rows={8}
        placeholder="Voeg hier je opmerkingen over de duik toe..."
        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-4"
      />

    </div>
  );
}