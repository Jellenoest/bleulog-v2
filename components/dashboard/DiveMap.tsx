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

export default function DiveMap({
  dives,
  title = "Duiklocaties",
  height = "600px",
}: DiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [5.2913, 52.1326],
      zoom: 6,
    });

    map.addControl(
      new maplibregl.NavigationControl()
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);
    useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const markers: maplibregl.Marker[] = [];
    const bounds = new maplibregl.LngLatBounds();

    dives.forEach((dive) => {
      if (!dive.latitude || !dive.longitude) return;

      const marker = new maplibregl.Marker({
        color: "#06b6d4",
      })
        .setLngLat([
          dive.longitude,
          dive.latitude,
        ])
        .setPopup(
          new maplibregl.Popup().setHTML(`
            <strong>Duik #${dive.diveNumber}</strong><br/>
            📍 ${dive.location}<br/>
            ⬇ ${dive.maxDepth} meter<br/>
            📅 ${dive.date}
          `)
        )
        .addTo(map);

      markers.push(marker);

      bounds.extend([
        dive.longitude,
        dive.latitude,
      ]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: 75,
        maxZoom: 12,
        duration: 1200,
      });
    }

    return () => {
      markers.forEach((marker) =>
        marker.remove()
      );
    };
  }, [dives]);
    return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-4 text-2xl font-bold">
        {title}
      </h2>

      <div
        ref={mapContainer}
        style={{
          height,
        }}
        className="w-full overflow-hidden rounded-xl"
      />

    </div>
  );
}