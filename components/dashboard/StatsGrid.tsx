type StatsGridProps = {
  totalDives: number;
  totalMinutes: number;
  maxDepth: number;
  averageDepth: string;
  nightDives: number;
  freshWater: number;
  saltWater: number;
  totalPhotos: number;
};

type CardProps = {
  title: string;
  value: string | number;
  suffix?: string;
};

function StatCard({
  title,
  value,
  suffix,
}: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-5xl font-bold text-cyan-400">
        {value}
      </h2>

      {suffix && (
        <p className="mt-2 text-slate-500">
          {suffix}
        </p>
      )}

    </div>
  );
}

export default function StatsGrid({
  totalDives,
  totalMinutes,
  maxDepth,
  averageDepth,
  nightDives,
  freshWater,
  saltWater,
  totalPhotos,
}: StatsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Totaal aantal duiken"
        value={totalDives}
      />

      <StatCard
        title="Totale duiktijd"
        value={totalMinutes}
        suffix="minuten"
      />

      <StatCard
        title="Maximale diepte"
        value={maxDepth}
        suffix="meter"
      />

      <StatCard
        title="Gemiddelde diepte"
        value={averageDepth}
        suffix="meter"
      />

      <StatCard
        title="Nachtduiken"
        value={nightDives}
      />

      <StatCard
        title="Zoet water"
        value={freshWater}
      />

      <StatCard
        title="Zout water"
        value={saltWater}
      />

      <StatCard
        title="Foto's"
        value={totalPhotos}
      />

    </div>
  );
}