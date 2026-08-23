import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = (p) => {
  assert.ok(existsSync(p), `${p} ontbreekt`);
  return readFileSync(p, "utf8");
};
test("certificaten feature contract", () => {
  const sql = read("supabase/certificates.sql");
  for (const marker of [
    "create table if not exists public.certificates",
    "user_id uuid not null",
    "organization text not null",
    "certificate_name text not null",
    "image_url text",
    "image_storage_path text",
    "certificate-cards",
  ]) assert.ok(sql.includes(marker), marker);
  assert.ok(read("app/api/certificates/route.ts").includes('.eq("user_id", user.id)'));
  assert.ok(read("app/api/certificates/[id]/route.ts").includes("image_storage_path"));
  assert.ok(read("app/api/certificates/upload/route.ts").includes('const BUCKET = "certificate-cards"'));
  const api = read("lib/certificateApi.ts");
  for (const marker of ["getCertificates","createCertificate","deleteCertificate","uploadCertificateImage"]) {
    assert.ok(api.includes(marker), marker);
  }
  const client = read("components/certificates/CertificatesClient.tsx");
  assert.ok(client.includes("Certificaat toevoegen"));
  assert.ok(client.includes('type="file"'));
  assert.ok(client.includes("Verwijderen"));
  assert.ok(read("app/certificates/page.tsx").includes("CertificatesClient"));
  assert.ok(read("components/Sidebar.tsx").includes('href: "/certificates"'));
  assert.ok(read("components/MobileNav.tsx").includes('href="/certificates"'));
});
