"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSending(true);
      setError("");

      const supabase = createClient();

      const redirectTo =
        `${window.location.origin}` +
        "/auth/callback?next=/reset-password";

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo }
        );

      if (error) throw error;

      setSent(true);
    } catch (error) {
      console.error(
        "Resetmail versturen mislukt:",
        error
      );
      setError(
        "De resetmail kon niet worden verstuurd. Probeer het opnieuw."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="text-5xl">🔐</div>
          <h1 className="mt-3 text-3xl font-bold text-cyan-400">
            Wachtwoord vergeten
          </h1>
          <p className="mt-2 text-slate-400">
            Vul je e-mailadres in om een resetlink te ontvangen.
          </p>
        </div>

        {sent ? (
          <div className="space-y-5">
            <div className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-4 text-emerald-300">
              <p className="font-semibold">
                Resetlink verstuurd
              </p>
              <p className="mt-2 text-sm">
                Als dit e-mailadres bekend is, ontvang je een e-mail met een resetlink.
              </p>
            </div>

            <Link
              href="/login"
              className="block w-full rounded-lg border border-slate-600 px-5 py-3 text-center font-semibold hover:bg-slate-800"
            >
              Terug naar inloggen
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold">
                E-mailadres
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
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
              disabled={sending}
              className="w-full rounded-lg bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {sending
                ? "Versturen..."
                : "Resetlink versturen"}
            </button>

            <Link
              href="/login"
              className="block text-center text-sm text-slate-400 hover:text-slate-200"
            >
              Terug naar inloggen
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
