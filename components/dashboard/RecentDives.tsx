import Link from "next/link";
import { Dive } from "@/server/types/dive";

type RecentDivesProps = {
  dives: Dive[];
};

export default function RecentDives({
  dives,
}: RecentDivesProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Laatste duiken
        </h2>

        <Link
          href="/dives"
          className="text-cyan-400 hover:text-cyan-300"
        >
          Bekijk alle →
        </Link>

      </div>

      {dives.length === 0 ? (

        <p className="text-slate-400">
          Er zijn nog geen duiken opgeslagen.
        </p>

      ) : (

        <div className="space-y-4">

          {dives
            .slice(0, 5)
            .map((dive) => (

              <div
                key={dive.id}
                className="rounded-xl border border-slate-700 bg-slate-800 p-5 transition hover:border-cyan-500"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-lg font-bold text-white">
                      #{dive.diveNumber} • {dive.location}
                    </h3>

                    <p className="text-slate-400">
                      {dive.country}
                    </p>

                  </div>

                  <div className="text-right">

                    <div className="font-bold text-cyan-400">
                      {dive.maxDepth} m
                    </div>

                    <div className="text-sm text-slate-400">
                      {dive.duration} min
                    </div>

                  </div>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

                  <div>
                    <div className="text-slate-500">
                      Buddy
                    </div>

                    <div className="text-white">
                      {dive.buddy || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500">
                      Datum
                    </div>

                    <div className="text-white">
                      {dive.date}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500">
                      Water
                    </div>

                    <div className="text-white">
                      {dive.waterType}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500">
                      Gas
                    </div>

                    <div className="text-white">
                      {dive.gas}
                    </div>
                  </div>

                </div>

              </div>

            ))}

        </div>

      )}

    </div>
  );
}