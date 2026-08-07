"use client";

import { Dive } from "@/server/types/dive";
import PhotoUploader from "@/components/photos/PhotoUploader";

type Props = {
  dive: Dive;
  onChange: (dive: Dive) => void;
};

export default function NotesSection({
  dive,
  onChange,
}: Props) {
  return (
    <>
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

        <h2 className="mb-6 text-2xl font-bold">
          Notities
        </h2>

        <textarea
          rows={8}
          value={dive.notes}
          onChange={(e) =>
            onChange({
              ...dive,
              notes: e.target.value,
            })
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

      </div>

      <PhotoUploader
        photos={dive.photos}
        onChange={(photos) =>
          onChange({
            ...dive,
            photos,
          })
        }
      />
          </>
  );
}