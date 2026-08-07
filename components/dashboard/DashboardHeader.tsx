type DashboardHeaderProps = {
  totalDives: number;
};

export default function DashboardHeader({
  totalDives,
}: DashboardHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-5xl font-bold text-white">
          BlueLog
        </h1>

        <p className="mt-2 text-lg text-slate-400">
          Persoonlijk digitaal duiklogboek
        </p>

        <div className="mt-4 inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">

          <span className="text-cyan-400 font-semibold">
            {totalDives}
          </span>

          <span className="ml-2 text-slate-300">
            geregistreerde duiken
          </span>

        </div>

      </div>

      <a
        href="/dives/new"
        className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        + Nieuwe duik
      </a>

    </div>
  );
}