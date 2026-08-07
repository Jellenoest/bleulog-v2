"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDives();
      setDives(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-20 text-center text-slate-400">
        Dashboard laden...
      </div>
    );
  }

  const totalDives = dives.length;

  const totalMinutes = dives.reduce(
    (sum, dive) => sum + dive.duration,
    0
  );

  const maxDepth =
    dives.length > 0
      ? Math.max(...dives.map((d) => d.maxDepth))
      : 0;

  const averageDepth =
    dives.length > 0
      ? dives.reduce(
          (sum, dive) => sum + dive.maxDepth,
          0
        ) / dives.length
      : 0;

  const totalPhotos = dives.reduce(
    (sum, dive) => sum + dive.photos.length,
    0
  );

  const locations = new Set(
    dives.map((dive) => dive.location)
  ).size;

  const lastDive =
    dives.length > 0 ? dives[0] : null;

  return (
    <div className="mx-auto max-w-7xl p-6">

      <DashboardHeader
        totalDives={totalDives}
      />

      <div className="mt-8">

        <QuickActions
          totalDives={totalDives}
          totalPhotos={totalPhotos}
          locations={locations}
        />

      </div>

      <div className="mt-8">

        <OverviewCards
          totalDives={totalDives}
          totalMinutes={totalMinutes}
          maxDepth={maxDepth}
          averageDepth={averageDepth}
          locations={locations}
          totalPhotos={totalPhotos}
        />

      </div>
<div className="mt-10">

  <PersonalRecords
    dives={dives}
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

        <RecentDives
          dives={dives}
        />

      </div>

      {lastDive && (

        <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              🤿 Laatste duik
            </h2>

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
                <span className="text-slate-400">
                  Duiknummer
                </span>

                <p className="text-lg font-semibold">
                  #{lastDive.diveNumber}
                </p>
              </div>

              <div>
                <span className="text-slate-400">
                  Datum
                </span>

                <p>{lastDive.date}</p>
              </div>

              <div>
                <span className="text-slate-400">
                  Buddy
                </span>

                <p>{lastDive.buddy || "-"}</p>
              </div>

            </div>

            <div className="space-y-3">

              <div>
                <span className="text-slate-400">
                  Locatie
                </span>

                <p>{lastDive.location}</p>
              </div>

              <div>
                <span className="text-slate-400">
                  Land
                </span>

                <p>{lastDive.country}</p>
              </div>

              <div>
                <span className="text-slate-400">
                  Type
                </span>

                <p>{lastDive.diveType}</p>
              </div>

            </div>

            <div className="space-y-3">

              <div>
                <span className="text-slate-400">
                  Maximale diepte
                </span>

                <p>{lastDive.maxDepth} meter</p>
              </div>

              <div>
                <span className="text-slate-400">
                  Duiktijd
                </span>

                <p>{lastDive.duration} minuten</p>
              </div>

              <div>
                <span className="text-slate-400">
                  Foto's
                </span>

                <p>{lastDive.photos.length}</p>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}