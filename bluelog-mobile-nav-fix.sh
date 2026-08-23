#!/usr/bin/env bash
set -euo pipefail
cd "${1:-$(pwd)}"

test -f package.json || { echo "Voer dit uit in /workspaces/BlueLog"; exit 1; }

cat > components/Layout.tsx <<'EOF'
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white md:flex">
      <Sidebar />

      <main className="min-h-screen flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
EOF

cat > components/MobileNav.tsx <<'EOF'
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const menu = [
  { name: "Home", href: "/", icon: "🏠" },
  { name: "Duiken", href: "/dives", icon: "🤿" },
  { name: "Kaart", href: "/map", icon: "🗺️" },
  { name: "Buddy's", href: "/buddies", icon: "👥" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(href: string) {
    return (
      pathname === href ||
      (href !== "/" && pathname.startsWith(href))
    );
  }

  async function logout() {
    try {
      setLoggingOut(true);

      const supabase = createClient();
      await supabase.auth.signOut();

      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
      setShowMore(false);
    }
  }

  return (
    <>
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setShowMore(false)}
        >
          <div
            className="absolute bottom-20 left-4 right-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3">
              <p className="font-bold text-cyan-400">🌊 BlueLog</p>
              <p className="text-sm text-slate-400">
                Persoonlijk digitaal duiklogboek
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="w-full rounded-lg border border-slate-600 px-4 py-3 font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-60"
            >
              {loggingOut ? "Uitloggen..." : "Uitloggen"}
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-900/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {menu.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center rounded-lg px-2 py-2 text-xs transition ${
                  active
                    ? "bg-cyan-500 font-bold text-slate-950"
                    : "text-slate-300"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="mt-1">{item.name}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setShowMore((current) => !current)}
            className={`flex flex-col items-center justify-center rounded-lg px-2 py-2 text-xs transition ${
              showMore
                ? "bg-cyan-500 font-bold text-slate-950"
                : "text-slate-300"
            }`}
          >
            <span className="text-xl">☰</span>
            <span className="mt-1">Meer</span>
          </button>
        </div>
      </nav>
    </>
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
    <aside className="hidden min-h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-900 md:flex">
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
            (item.href !== "/" &&
              pathname.startsWith(item.href));

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

              <span>{item.name}</span>
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

npm run build

echo
echo "KLAAR."
echo "Push daarna met:"
echo "git add components/Layout.tsx components/Sidebar.tsx components/MobileNav.tsx"
echo "git commit -m 'Improve mobile navigation'"
echo "git push"
