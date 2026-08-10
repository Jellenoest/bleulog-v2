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
