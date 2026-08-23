import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("login heeft aangemeld-blijven keuze", () => {
  const login = readFileSync("app/login/page.tsx", "utf8");
  const client = readFileSync("lib/supabase/client.ts", "utf8");
  assert.ok(login.includes("Aangemeld blijven"));
  assert.ok(login.includes("rememberMe"));
  assert.ok(login.includes("createClient(rememberMe)"));
  assert.ok(client.includes("rememberMe"));
  assert.ok(client.includes("localStorage"));
  assert.ok(client.includes("sessionStorage"));
});
