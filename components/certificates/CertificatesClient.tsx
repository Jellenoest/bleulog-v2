"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Certificate,
  createCertificate,
  deleteCertificate,
  getCertificates,
  uploadCertificateImage,
} from "@/lib/certificateApi";

const EMPTY_FORM = {
  organization: "",
  certificateName: "",
  certificateNumber: "",
  achievedDate: "",
  expiryDate: "",
  notes: "",
};

export default function CertificatesClient() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCertificates()
      .then(setCertificates)
      .catch((e) => setError(e instanceof Error ? e.message : "Laden mislukt."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.organization.trim() || !form.certificateName.trim()) {
      setError("Organisatie en certificaatnaam zijn verplicht.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let imageUrl = "";
      let imageStoragePath = "";

      if (image) {
        const uploaded = await uploadCertificateImage(image);
        imageUrl = uploaded.url;
        imageStoragePath = uploaded.storagePath;
      }

      const created = await createCertificate({
        ...form,
        imageUrl,
        imageStoragePath,
      });

      setCertificates((current) => [created, ...current]);
      setForm(EMPTY_FORM);
      setImage(null);

      const input = document.getElementById("certificate-image") as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  }

  async function removeCertificate(certificate: Certificate) {
    if (!window.confirm(`${certificate.certificateName} verwijderen?`)) return;

    try {
      await deleteCertificate(certificate.id);
      setCertificates((current) =>
        current.filter((item) => item.id !== certificate.id)
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verwijderen mislukt.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold">Certificaat toevoegen</h2>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <span className="mb-2 block">Organisatie *</span>
            <input
              value={form.organization}
              onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
              placeholder="PADI, SSI, NOB..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </label>

          <label>
            <span className="mb-2 block">Certificaat / niveau *</span>
            <input
              value={form.certificateName}
              onChange={(e) => setForm((f) => ({ ...f, certificateName: e.target.value }))}
              placeholder="Open Water Diver"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </label>

          <label>
            <span className="mb-2 block">Certificaatnummer</span>
            <input
              value={form.certificateNumber}
              onChange={(e) => setForm((f) => ({ ...f, certificateNumber: e.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </label>

          <label>
            <span className="mb-2 block">Behaaldatum</span>
            <input
              type="date"
              value={form.achievedDate}
              onChange={(e) => setForm((f) => ({ ...f, achievedDate: e.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </label>

          <label>
            <span className="mb-2 block">Vervaldatum</span>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </label>

          <label>
            <span className="mb-2 block">Afbeelding pasje</span>
            <input
              id="certificate-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="block w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
            <span className="mt-1 block text-xs text-slate-400">Maximaal 4 MB.</span>
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block">Notities</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </label>

          {error && <p className="md:col-span-2 text-amber-400">{error}</p>}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Opslaan..." : "Certificaat opslaan"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Mijn certificaten</h2>

        {loading ? (
          <p className="text-slate-400">Certificaten laden...</p>
        ) : certificates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
            Nog geen certificaten toegevoegd.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {certificates.map((certificate) => (
              <article key={certificate.id} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
                {certificate.imageUrl && (
                  <a href={certificate.imageUrl} target="_blank" rel="noreferrer">
                    <img
                      src={certificate.imageUrl}
                      alt={`Pasje ${certificate.certificateName}`}
                      className="h-56 w-full bg-slate-950 object-contain"
                    />
                  </a>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
                        {certificate.organization}
                      </p>
                      <h3 className="mt-1 text-xl font-bold">{certificate.certificateName}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCertificate(certificate)}
                      className="rounded-lg border border-red-700 px-3 py-2 text-sm text-red-300 hover:bg-red-950"
                    >
                      Verwijderen
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <p><span className="text-slate-400">Nummer:</span> {certificate.certificateNumber || "—"}</p>
                    <p><span className="text-slate-400">Behaald:</span> {certificate.achievedDate || "—"}</p>
                    <p><span className="text-slate-400">Vervalt:</span> {certificate.expiryDate || "Niet van toepassing"}</p>
                  </div>

                  {certificate.notes && (
                    <p className="mt-5 whitespace-pre-wrap text-sm text-slate-300">{certificate.notes}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
