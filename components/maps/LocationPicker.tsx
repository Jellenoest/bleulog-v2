"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  latitude: number;
  longitude: number;
  onChange: (
    latitude: number,
    longitude: number
  ) => void;
};

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
}: Props) {
  const mapContainer =
    useRef<HTMLDivElement>(null);

  const mapRef =
    useRef<maplibregl.Map | null>(null);

  const markerRef =
    useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (mapRef.current) return;

  const map = new maplibregl.Map({
  container: mapContainer.current,
  style: `https://api.maptiler.com/maps/satellite/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center:
        longitude !== 0 && latitude !== 0
          ? [longitude, latitude]
          : [5.2913, 52.1326],
    zoom:
  longitude !== 0 && latitude !== 0
    ? 15
    : 7,
maxZoom: 20,
minZoom: 2,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    map.on("click", (event) => {
      const lng = event.lngLat.lng;
      const lat = event.lngLat.lat;

      onChange(lat, lng);
            if (markerRef.current) {
        markerRef.current.remove();
      }

     const marker = document.createElement("div");
marker.innerHTML = "📍";
marker.style.fontSize = "42px";

markerRef.current = new maplibregl.Marker({
  element: marker,
})
        .setLngLat([lng, lat])
        .addTo(map);

    });

    if (longitude !== 0 && latitude !== 0) {
      markerRef.current = new maplibregl.Marker({
        color: "#06b6d4",
      })
        .setLngLat([longitude, latitude])
        .addTo(map);
    }

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (latitude === 0 && longitude === 0) return;

    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 10,
      duration: 1000,
    });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new maplibregl.Marker({
      color: "#06b6d4",
    })
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

  }, [latitude, longitude]);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold">
        Locatie kiezen
      </h2>

      <div
        ref={mapContainer}
        className="h-[450px] w-full overflow-hidden rounded-xl"
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Latitude
          </label>

          <input
            readOnly
            value={latitude}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Longitude
          </label>

          <input
            readOnly
            value={longitude}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

      </div>

      <p className="mt-4 text-sm text-slate-400">
        Tik op de kaart om de exacte duiklocatie te kiezen.
      </p>

    </div>
  );
}