type Props = {
  totalDives: number;
  totalMinutes: number;
  maxDepth: number;
  averageDepth: number;
  locations: number;
  totalPhotos: number;
};

type CardProps = {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
};

function Card({
  icon,
  title,
  value,
  subtitle,
}: CardProps) {
  return (
    <div className="group rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">

      <div className="flex items-center justify-between">

        <div className="text-5xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <div className="text-right">

          <div className="text-4xl font-bold text-cyan-400">
            {value}
          </div>

          {subtitle && (
            <div className="mt-1 text-sm text-slate-500">
              {subtitle}
            </div>
          )}

        </div>

      </div>

      <div className="mt-6 border-t border-slate-700 pt-4">

        <h3 className="text-lg font-semibold">
          {title}
        </h3>

      </div>

    </div>
  );
}

export default function OverviewCards({
  totalDives,
  totalMinutes,
  maxDepth,
  averageDepth,
  locations,
  totalPhotos,
}: Props) {

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const diveTime =
    hours > 0
      ? `${hours}u ${minutes}m`
      : `${minutes} min`;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            <Card
        icon="🤿"
        title="Totaal aantal duiken"
        value={totalDives}
      />

      <Card
        icon="⏱"
        title="Totale duiktijd"
        value={diveTime}
      />

      <Card
        icon="⬇"
        title="Maximale diepte"
        value={`${maxDepth.toFixed(1)} m`}
      />

      <Card
        icon="📏"
        title="Gemiddelde diepte"
        value={`${averageDepth.toFixed(1)} m`}
      />

      <Card
        icon="🌍"
        title="Duiklocaties"
        value={locations}
      />

      <Card
        icon="📷"
        title="Foto's"
        value={totalPhotos}
      />

    </div>
  );
}