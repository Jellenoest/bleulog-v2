"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Dive } from "@/server/types/dive";
import { getDives } from "@/lib/storage";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewCards from "@/components/dashboard/OverviewCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentDives from "@/components/dashboard/RecentDives";
import PersonalRecords from "@/components/dashboard/PersonalRecords";
import DiveMap from "@/components/DiveMap";

export default function HomePage() {
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const diveData = await getDives();

        const sorted = [...diveData].sort((a, b) => {
          const byNumber =
            (Number(b.diveNumber) || 0) - (Number(a.diveNumber) || 0);

          if (byNumber !== 0) return byNumber;

          return String(b.date ?? "").localeCompare(String(a.date ?? ""));
        });

        setDives(sorted);
      } catch (err) {
        console.error("Dashboard laden mislukt:", err);
        setError("Dashboard kon niet worden geladen.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const totalDives = dives.length;

    const totalMinutes = dives.reduce(
      (sum, dive) => sum + (Number(dive.duration) || 0),
      0
    );

    const maxDepth = dives.reduce(
      (max, dive) => Math.max(max, Number(dive.maxDepth) || 0),
      0
    );

    const averageDepth =
      totalDives > 0
        ? dives.reduce(
            (sum, dive) => sum + (Number(dive.maxDepth) || 0),
            0
          ) / totalDives
        : 0;

    const totalPhotos = dives.reduce(
      (sum, dive) =>
        sum + (Array.isArray(dive.photos) ? dive.photos.length : 0),
      0
    );

    const locations = new Set(
      dives
        .map((dive) => String(dive.location ?? "").trim())
        .filter(Boolean)
    ).size;

    return {
      totalDives,
      totalMinutes,
      maxDepth,
      averageDepth,
      totalPhotos,
      locations,
    };
  }, [dives]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
          Dashboard laden...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <div className="rounded-xl border border-red-700 bg-slate-900 p-8">
          <h1 className="text-2xl font-bold">Dashboard niet beschikbaar</h1>
          <p className="mt-3 text-slate-400">{error}</p>
        </div>
      </main>
    );
  }

  const lastDive = dives.length > 0 ? dives[0] : null;

  return (
    <main className="mx-auto max-w-7xl p-8">
      <DashboardHeader totalDives={stats.totalDives} />

      <div className="mt-8">
        <QuickActions
          totalDives={stats.totalDives}
          totalPhotos={stats.totalPhotos}
          locations={stats.locations}
        />
      </div>

      <div className="mt-8">
        <OverviewCards
          totalDives={stats.totalDives}
          totalMinutes={stats.totalMinutes}
          maxDepth={stats.maxDepth}
          averageDepth={stats.averageDepth}
          locations={stats.locations}
          totalPhotos={stats.totalPhotos}
        />
      </div>

      <div className="mt-10">
        <DiveMap
          dives={dives}
          title="🌍 Wereldkaart"
          height="500px"
        />
      </div>

      <div className="mt-10">
        <RecentDives dives={dives} />
      </div>

      <div className="mt-10">
        <PersonalRecords dives={dives} />
      </div>

      {lastDive && (
        <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🤿 Laatste duik</h2>

            <Link
              href={`/dives/${lastDive.id}`}
              className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900 hover:bg-cyan-400"
            >
              Open duik
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              <div>
                <span className="text-slate-400">Duiknummer</span>
                <p className="text-lg font-semibold">
                  #{lastDive.diveNumber}
                </p>
              </div>

              <div>
                <span className="text-slate-400">Datum</span>
                <p>{lastDive.date}</p>
              </div>

              <div>
                <span className="text-slate-400">Buddy</span>
                <p>{lastDive.buddy || "-"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400">Locatie</span>
                <p>{lastDive.location}</p>
              </div>

              <div>
                <span className="text-slate-400">Land</span>
                <p>{lastDive.country}</p>
              </div>

              <div>
                <span className="text-slate-400">Type</span>
                <p>{lastDive.diveType}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400">Maximale diepte</span>
                <p>{lastDive.maxDepth} meter</p>
              </div>

              <div>
                <span className="text-slate-400">Duiktijd</span>
                <p>{lastDive.duration} minuten</p>
              </div>

              <div>
                <span className="text-slate-400">Foto&apos;s</span>
                <p>
                  {Array.isArray(lastDive.photos)
                    ? lastDive.photos.length
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
