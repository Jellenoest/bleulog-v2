import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("BlueLog heeft een read-only Supabase health endpoint en dagelijkse Vercel cron", () => {
  assert.equal(
    fs.existsSync("app/api/health/route.ts"),
    true,
    "health route ontbreekt"
  );

  const route = fs.readFileSync("app/api/health/route.ts", "utf8");
  assert.match(route, /from\(["']dives["']\)/, "health route moet de dives tabel lezen");
  assert.match(route, /head:\s*true/, "health route mag geen duikgegevens ophalen");
  assert.doesNotMatch(route, /\.(insert|update|delete|upsert)\s*\(/, "health route mag niets wijzigen");

  assert.equal(fs.existsSync("vercel.json"), true, "vercel.json ontbreekt");
  const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
  assert.ok(Array.isArray(vercel.crons), "crons configuratie ontbreekt");
  assert.ok(
    vercel.crons.some(
      (cron) => cron.path === "/api/health" && cron.schedule === "17 6 * * *"
    ),
    "dagelijkse /api/health cron ontbreekt"
  );
});
