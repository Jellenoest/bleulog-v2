type Props = {
  totalDives: number;
  totalPhotos: number;
  locations: number;
};

export default function QuickActions({
  totalDives,
  totalPhotos,
  locations,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <div className="text-sm text-slate-400">
          📖 Duiken
        </div>

        <div className="mt-2 text-4xl font-bold text-cyan-400">
          {totalDives}
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <div className="text-sm text-slate-400">
          📷 Foto's
        </div>

        <div className="mt-2 text-4xl font-bold text-cyan-400">
          {totalPhotos}
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <div className="text-sm text-slate-400">
          🌍 Locaties
        </div>

        <div className="mt-2 text-4xl font-bold text-cyan-400">
          {locations}
        </div>
      </div>

    </div>
  );
}