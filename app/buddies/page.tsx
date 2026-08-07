"use client";

import BuddyForm from "@/components/buddies/BuddyForm";
import { useEffect, useState } from "react";
import {
  Buddy,
  getBuddies,
  createBuddy,
  deleteBuddy,
} from "@/lib/buddyApi";

export default function BuddiesPage() {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
function handleChange(
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLSelectElement |
    HTMLTextAreaElement
  >
) {
  const target = e.target;
  const { name, value, type } = e.target;

  if (type === "checkbox") {
    setForm((prev) => ({
      ...prev,
      [name]: (e.target as HTMLInputElement).checked,
    }));
    return;
  }

  if (type === "number") {
    setForm((prev) => ({
      ...prev,
      [name]: Number(target.value),
    }));
    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: target.value,
  }));
}

 const [form, setForm] = useState<Omit<Buddy, "id">>({
  firstName: "",
  lastName: "",
  nickName: "",
  birthDate: "",
  phone: "",
  email: "",
  certificationAgency: "",
  certificationLevel: "",
  nitrox: false,
  totalDives: 0,
  notes: "",
});

  async function loadBuddies() {
    const data = await getBuddies();
    setBuddies(data);
  }

  useEffect(() => {
    loadBuddies();
  }, []);

async function saveBuddy() {
  if (!form.firstName.trim() || !form.lastName.trim()) {
    alert("Voornaam en achternaam zijn verplicht.");
    return;
  }

  await createBuddy(form);

  setForm({
    firstName: "",
    lastName: "",
    nickName: "",
    birthDate: "",
    phone: "",
    email: "",
    certificationAgency: "",
    certificationLevel: "",
    nitrox: false,
    totalDives: 0,
    notes: "",
  });

  loadBuddies();
}
  async function removeBuddy(id: string) {
    if (!confirm("Weet je zeker dat je deze buddy wilt verwijderen?")) {
      return;
    }

    await deleteBuddy(id);
    loadBuddies();
  }

  return (
    <main className="mx-auto max-w-5xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Buddy's
      </h1>
<BuddyForm
  buddy={form}
  onChange={handleChange}
  onSubmit={saveBuddy}
/>
  

        
      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">

        <h2 className="mb-4 text-2xl font-bold">
          Mijn buddy's
        </h2>

        <div className="space-y-3">

          {buddies.map((buddy) => (

            <div
              key={buddy.id}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4"
            >

              <div>

                <div className="font-semibold">
                  {buddy.firstName} {buddy.lastName}
                </div>

                <div className="text-sm text-slate-400">
                  {buddy.phone || "Geen telefoonnummer"}
                </div>

              </div>

              <button
                onClick={() => removeBuddy(buddy.id)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Verwijderen
              </button>

            </div>

          ))}

          {buddies.length === 0 && (
            <div className="text-slate-400">
              Nog geen buddy's toegevoegd.
            </div>
          )}

        </div>

      </div>

    </main>
  );
}