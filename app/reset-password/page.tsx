"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] =
    useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (password.length < 8) {
      setError(
        "Gebruik minimaal 8 tekens."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "De twee wachtwoorden zijn niet hetzelfde."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const supabase = createClient();

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) throw error;

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Wachtwoord wijzigen mislukt:",
        error
      );
      setError(
        "Het wachtwoord kon niet worden gewijzigd. Vraag eventueel een nieuwe resetlink aan."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="text-5xl">🔑</div>
          <h1 className="mt-3 text-3xl font-bold text-cyan-400">
            Nieuw wachtwoord
          </h1>
          <p className="mt-2 text-slate-400">
            Kies een nieuw wachtwoord voor BlueLog.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Nieuw wachtwoord
            </label>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Wachtwoord bevestigen
            </label>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {saving
              ? "Opslaan..."
              : "Nieuw wachtwoord opslaan"}
          </button>
        </form>
      </div>
    </main>
  );
}
