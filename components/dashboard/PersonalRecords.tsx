"use client";

import { Dive } from "@/server/types/dive";

type Props = {
  dives: Dive[];
};

type RecordCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

function RecordCard({
  title,
  value,
  subtitle,
}: RecordCardProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-bold text-cyan-400">
        {value}
      </h3>

      {subtitle && (
        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function PersonalRecords({
  dives,
}: Props) {
  if (dives.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">
          🏆 Persoonlijke records
        </h2>

        <p className="text-slate-400">
          Nog geen duiken beschikbaar.
        </p>
      </div>
    );
  }

  const deepestDive = dives.reduce((best, dive) =>
    dive.maxDepth > best.maxDepth ? dive : best
  );

  const longestDive = dives.reduce((best, dive) =>
    dive.duration > best.duration ? dive : best
  );

  const warmestDive = dives.reduce((best, dive) =>
    dive.waterTemperature > best.waterTemperature
      ? dive
      : best
  );

  const coldestDive = dives.reduce((best, dive) =>
    dive.waterTemperature < best.waterTemperature
      ? dive
      : best
  );
    const mostPhotosDive = dives.reduce((best, dive) =>
    dive.photos.length > best.photos.length
      ? dive
      : best
  );

  const buddyCount: Record<string, number> = {};

  dives.forEach((dive) => {
    if (!dive.buddy) return;

    buddyCount[dive.buddy] =
      (buddyCount[dive.buddy] ?? 0) + 1;
  });

  const favoriteBuddy =
    Object.entries(buddyCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "-";

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold">
        🏆 Persoonlijke records
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <RecordCard
          title="⬇ Diepste duik"
          value={`${deepestDive.maxDepth.toFixed(1)} m`}
          subtitle={deepestDive.location}
        />

        <RecordCard
          title="⏱ Langste duik"
          value={`${longestDive.duration} min`}
          subtitle={longestDive.location}
        />

        <RecordCard
          title="🌡 Warmste water"
          value={`${warmestDive.waterTemperature} °C`}
          subtitle={warmestDive.location}
        />

        <RecordCard
          title="🥶 Koudste water"
          value={`${coldestDive.waterTemperature} °C`}
          subtitle={coldestDive.location}
        />
                <RecordCard
          title="📷 Meeste foto's"
          value={mostPhotosDive.photos.length}
          subtitle={mostPhotosDive.location}
        />

        <RecordCard
          title="👤 Favoriete buddy"
          value={favoriteBuddy}
          subtitle="Meest gebruikte buddy"
        />

      </div>

    </div>
  );
}