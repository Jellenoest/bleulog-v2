import { createBrowserClient } from "@supabase/ssr";

export function createClient(rememberMe = true) {
  const storage =
    typeof window === "undefined"
      ? undefined
      : rememberMe
        ? window.localStorage
        : window.sessionStorage;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    storage
      ? {
          auth: {
            storage,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        }
      : undefined
  );
}
