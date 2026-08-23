"use client";

import { useEffect, useState } from "react";
import { Dive } from "@/server/types/dive";
import { Buddy, getBuddies } from "@/lib/buddyApi";
import DiveSiteSearch from "./DiveSiteSearch";
import type { DiveSite } from "./DiveSiteSearch";

type Props = {
  dive: Dive;
  onChange: (dive: Dive) => void;
};

export default function BasicInfoSection({
  dive,
  onChange,
}: Props) {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [loadingBuddies, setLoadingBuddies] = useState(true);
  const [buddyError, setBuddyError] = useState("");

  useEffect(() => {
    let active = true;

    getBuddies()
      .then((items) => {
        if (!active) return;
        setBuddies(items);
        setBuddyError("");
      })
      .catch((error) => {
        console.error("Buddies laden mislukt:", error);
        if (!active) return;
        setBuddyError("Buddies konden niet worden geladen.");
      })
      .finally(() => {
        if (active) setLoadingBuddies(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function selectDiveSite(site: DiveSite) {
    onChange({
      ...dive,
      location: site.name,
      country: site.country,
      latitude: site.latitude,
      longitude: site.longitude,
      waterType: site.waterType as "Zoet" | "Zout",
      diveType: site.entryType as "Boot" | "Kant",
    });
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Basisgegevens
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block">
            Datum
          </label>

          <input
            type="date"
            value={dive.date}
            onChange={(e) =>
              onChange({
                ...dive,
                date: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Buddy
          </label>

          <select
            value={dive.buddy}
            disabled={loadingBuddies}
            onChange={(e) =>
              onChange({
                ...dive,
                buddy: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 disabled:opacity-60"
          >
            <option value="">
              {loadingBuddies
                ? "Buddies laden..."
                : "Kies een buddy"}
            </option>

            {buddies.map((buddy) => {
              const fullName = `${buddy.firstName} ${buddy.lastName}`.trim();

              return (
                <option
                  key={buddy.id}
                  value={fullName}
                >
                  {fullName || buddy.nickName || "Naamloos"}
                </option>
              );
            })}
          </select>

          {buddyError && (
            <p className="mt-2 text-sm text-amber-400">
              {buddyError}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block">
            Duikstek
          </label>

          <DiveSiteSearch
            value={dive.location}
            onSelect={selectDiveSite}
          />
        </div>

        <div>
          <label className="mb-2 block">
            Land
          </label>

          <input
            value={dive.country}
            readOnly
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-slate-300"
          />
        </div>

        <div>
          <label className="mb-2 block">
            Type duik
          </label>

          <select
            value={dive.diveType}
            onChange={(e) =>
              onChange({
                ...dive,
                diveType: e.target.value as "Boot" | "Kant",
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="Boot">
              Boot
            </option>

            <option value="Kant">
              Kant
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block">
            Watertype
          </label>

          <select
            value={dive.waterType}
            onChange={(e) =>
              onChange({
                ...dive,
                waterType: e.target.value as "Zoet" | "Zout",
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="Zoet">
              Zoet
            </option>

            <option value="Zout">
              Zout
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
