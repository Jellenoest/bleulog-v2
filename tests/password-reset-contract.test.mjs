import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  assert.ok(existsSync(path), `${path} ontbreekt`);
  return readFileSync(path, "utf8");
}

test("wachtwoord vergeten flow is compleet", () => {
  const login = read("app/login/page.tsx");
  assert.ok(login.includes("/forgot-password"));
  assert.ok(login.includes("Wachtwoord vergeten?"));
  assert.ok(login.includes("Aangemeld blijven"));

  const forgot = read("app/forgot-password/page.tsx");
  assert.ok(forgot.includes("resetPasswordForEmail"));
  assert.ok(forgot.includes("/auth/callback?next=/reset-password"));
  assert.ok(forgot.includes("Resetlink verstuurd"));

  const callback = read("app/auth/callback/route.ts");
  assert.ok(callback.includes("exchangeCodeForSession"));

  const reset = read("app/reset-password/page.tsx");
  assert.ok(reset.includes("updateUser"));
  assert.ok(reset.includes("Wachtwoord bevestigen"));
});
