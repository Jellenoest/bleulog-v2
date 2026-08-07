"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-900">

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

              <span>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 p-4">
        <div className="rounded-lg bg-slate-800 p-4 text-sm text-slate-400">

          <p className="font-semibold text-cyan-400">
            BlueLog
          </p>

          <p className="mt-1">
            Persoonlijk digitaal duiklogboek
          </p>

        </div>
      </div>

    </aside>
  );
}