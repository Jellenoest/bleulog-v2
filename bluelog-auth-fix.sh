#!/usr/bin/env bash
set -euo pipefail
cd "${1:-$(pwd)}"

test -f package.json || { echo "Voer dit uit in /workspaces/BlueLog"; exit 1; }

echo "1/6 Supabase SSR package installeren..."
npm install @supabase/ssr

echo "2/6 Supabase auth helpers maken..."
mkdir -p lib/supabase app/login

cat > lib/supabase/client.ts <<'EOF'
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
EOF

cat > lib/supabase/server.ts <<'EOF'
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components kunnen cookies niet schrijven.
            // proxy.ts ververst de sessie.
          }
        },
      },
    }
  );
}
EOF

echo "3/6 Loginpagina maken..."

cat > app/login/page.tsx <<'EOF'
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Inloggen mislukt:", error);
      setError("E-mailadres of wachtwoord is niet juist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="text-5xl">🌊</div>
          <h1 className="mt-3 text-4xl font-bold text-cyan-400">
            BlueLog
          </h1>
          <p className="mt-2 text-slate-400">
            Log in om je duiklogboek te openen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              E-mailadres
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Wachtwoord
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Inloggen..." : "Inloggen"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          BlueLog is alleen toegankelijk voor geautoriseerde gebruikers.
        </p>
      </div>
    </main>
  );
}
EOF

echo "4/6 Layout en uitloggen aanpassen..."

cat > components/Layout.tsx <<'EOF'
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
EOF

cat > components/Sidebar.tsx <<'EOF'
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const menu = [
  {
    name: "Dashboard",
    href: "/",
    icon: "🏠",
  },
  {
    name: "Mijn duiken",
    href: "/dives",
    icon: "🤿",
  },
  {
    name: "Kaart",
    href: "/map",
    icon: "🗺️",
  },
  {
    name: "Buddy's",
    href: "/buddies",
    icon: "👥",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 md:flex">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-4xl font-bold text-cyan-400">
          🌊 BlueLog
        </h1>

        <p className="mt-2 text-slate-400">
          Digitaal Duiklogboek
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {menu.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                active
                  ? "bg-cyan-500 font-bold text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="text-xl">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 p-4">
        <div className="rounded-lg bg-slate-800 p-4 text-sm">
          <p className="font-semibold text-cyan-400">
            Ingelogd
          </p>

          <p className="mt-1 truncate text-slate-400">
            {email || "BlueLog gebruiker"}
          </p>

          <button
            type="button"
            onClick={logout}
            className="mt-4 w-full rounded-lg border border-slate-600 px-4 py-2 font-semibold text-slate-200 hover:bg-slate-700"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </aside>
  );
}
EOF

echo "5/6 Next.js 16 proxy beveiligen..."

cat > proxy.ts <<'EOF'
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, _headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims?.sub);

  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === "/login";
  const isApi = pathname.startsWith("/api/");

  if (!loggedIn && !isLogin) {
    if (isApi) {
      return NextResponse.json(
        { error: "Niet ingelogd." },
        { status: 401 }
      );
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";

    return NextResponse.redirect(url);
  }

  if (loggedIn && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";

    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
EOF

echo "6/6 Build controleren..."

npm run build

echo
echo "KLAAR."
echo
echo "Nog nodig in .env.local EN Vercel:"
echo "NEXT_PUBLIC_SUPABASE_URL"
echo "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
echo
echo "Push daarna met:"
echo "git add package.json package-lock.json proxy.ts app/login/page.tsx components/Layout.tsx components/Sidebar.tsx lib/supabase"
echo "git commit -m 'Add private BlueLog login'"
echo "git push"
