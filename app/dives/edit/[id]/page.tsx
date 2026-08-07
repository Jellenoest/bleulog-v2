"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DiveForm from "@/components/DiveForm";
import { Dive } from "@/server/types/dive";
import { getDive } from "@/lib/storage";

export default function EditDivePage() {
  const params = useParams();
  const id = params.id as string;

  const [dive, setDive] = useState<Dive | null>(null);

  useEffect(() => {
    const found = getDive(id);

    if (found) {
      setDive(found);
    }
  }, [id]);

  if (!dive) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-slate-400">
          Duik laden...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">

      <h1 className="mb-8 text-4xl font-bold">
        Duik bewerken
      </h1>

      <DiveForm
        mode="edit"
        initialDive={dive}
      />

    </div>
  );
}