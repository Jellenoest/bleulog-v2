import CertificatesClient from "@/components/certificates/CertificatesClient";

export default function CertificatesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Certificaten</h1>
        <p className="mt-2 text-slate-400">
          Bewaar je duikcertificaten en één afbeelding van het pasje.
        </p>
      </div>
      <CertificatesClient />
    </div>
  );
}
