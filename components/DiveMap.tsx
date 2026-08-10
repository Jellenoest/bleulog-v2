"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { Dive } from "@/server/types/dive";

type DiveMapProps = {
  dives: Dive[];
  title?: string;
  height?: string;
};

type DiveGroup = {
  latitude: number;
  longitude: number;
  location: string;
  country: string;
  dives: Dive[];
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function DiveMap({
  dives,
  title = "Duiklocaties",
  height = "600px",
}: DiveMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [5.2913, 52.1326],
      zoom: 5,
      maxZoom: 20,
      minZoom: 2,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers: maplibregl.Marker[] = [];
    const bounds = new maplibregl.LngLatBounds();

    const groups = new Map<string, DiveGroup>();

    for (const dive of dives) {
      const latitude = Number(dive.latitude);
      const longitude = Number(dive.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude === 0 ||
        longitude === 0
      ) {
        continue;
      }

      const key = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;

      const existing = groups.get(key);

      if (existing) {
        existing.dives.push(dive);
      } else {
        groups.set(key, {
          latitude,
          longitude,
          location: dive.location || "Onbekende locatie",
          country: dive.country || "",
          dives: [dive],
        });
      }
    }

    for (const group of groups.values()) {
      group.dives.sort(
        (a, b) =>
          (Number(b.diveNumber) || 0) -
          (Number(a.diveNumber) || 0)
      );

      const markerElement = document.createElement("div");
      markerElement.style.width =
        group.dives.length > 1 ? "42px" : "34px";
      markerElement.style.height =
        group.dives.length > 1 ? "42px" : "34px";
      markerElement.style.borderRadius = "9999px";
      markerElement.style.background = "#06b6d4";
      markerElement.style.border = "3px solid white";
      markerElement.style.boxShadow =
        "0 4px 14px rgba(0,0,0,0.45)";
      markerElement.style.display = "flex";
      markerElement.style.alignItems = "center";
      markerElement.style.justifyContent = "center";
      markerElement.style.fontWeight = "800";
      markerElement.style.fontSize = "14px";
      markerElement.style.color = "#082f49";
      markerElement.style.cursor = "pointer";

      markerElement.textContent =
        group.dives.length > 1
          ? String(group.dives.length)
          : "●";

      const diveRows = group.dives
        .map((dive) => {
          const id = encodeURIComponent(String(dive.id));

          return `
            <a
              href="/dives/${id}"
              style="
                display:block;
                text-decoration:none;
                color:#e2e8f0;
                padding:10px 12px;
                margin-top:8px;
                border:1px solid #334155;
                border-radius:10px;
                background:#1e293b;
              "
            >
              <div style="font-weight:700;color:#67e8f9;">
                Duik #${escapeHtml(dive.diveNumber)}
              </div>
              <div style="font-size:12px;margin-top:4px;color:#cbd5e1;">
                📅 ${escapeHtml(dive.date || "-")}
                &nbsp;•&nbsp;
                ⬇ ${escapeHtml(dive.maxDepth)} m
                &nbsp;•&nbsp;
                ⏱ ${escapeHtml(dive.duration)} min
              </div>
            </a>
          `;
        })
        .join("");

      const popupHtml = `
        <div
          style="
            min-width:240px;
            max-width:320px;
            background:#0f172a;
            color:#f8fafc;
            padding:14px;
            border-radius:12px;
            font-family:Arial,sans-serif;
          "
        >
          <div style="font-size:16px;font-weight:800;color:#22d3ee;">
            ${escapeHtml(group.location)}
          </div>

          ${
            group.country
              ? `<div style="margin-top:4px;font-size:12px;color:#94a3b8;">
                   ${escapeHtml(group.country)}
                 </div>`
              : ""
          }

          <div style="margin-top:10px;font-size:13px;color:#cbd5e1;">
            ${group.dives.length}
            ${group.dives.length === 1 ? "duik" : "duiken"} op deze locatie
          </div>

          <div style="margin-top:8px;">
            ${diveRows}
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 24,
        closeButton: true,
        maxWidth: "340px",
      }).setHTML(popupHtml);

      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: "bottom",
      })
        .setLngLat([
          group.longitude,
          group.latitude,
        ])
        .setPopup(popup)
        .addTo(map);

      markers.push(marker);

      bounds.extend([
        group.longitude,
        group.latitude,
      ]);
    }

    const fitMap = () => {
      if (bounds.isEmpty()) return;

      if (groups.size === 1) {
        const only = [...groups.values()][0];

        map.flyTo({
          center: [only.longitude, only.latitude],
          zoom: 13,
          duration: 900,
        });
      } else {
        map.fitBounds(bounds, {
          padding: 80,
          maxZoom: 8,
          duration: 1200,
        });
      }
    };

    if (map.loaded()) {
      fitMap();
    } else {
      map.once("load", fitMap);
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [dives]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        {title}
      </h2>

      <div
        ref={mapContainer}
        style={{ height }}
        className="w-full overflow-hidden rounded-xl"
      />
    </div>
  );
}
