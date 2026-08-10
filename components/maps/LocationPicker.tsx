"use client";

import { useEffect, useRef, useState } from "react";
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState("");

  function setMarker(
    map: maplibregl.Map,
    lat: number,
    lng: number
  ) {
    if (markerRef.current) {
      markerRef.current.remove();
    }

    const markerElement = document.createElement("div");
    markerElement.innerHTML = "📍";
    markerElement.style.fontSize = "42px";
    markerElement.style.cursor = "grab";

    const marker = new maplibregl.Marker({
      element: markerElement,
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(map);

    marker.on("dragend", () => {
      const position = marker.getLngLat();
      onChange(
        Number(position.lat.toFixed(6)),
        Number(position.lng.toFixed(6))
      );
    });

    markerRef.current = marker;
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGpsError("GPS wordt niet ondersteund door deze browser.");
      return;
    }

    setLocating(true);
    setGpsError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(
          position.coords.latitude.toFixed(6)
        );
        const lng = Number(
          position.coords.longitude.toFixed(6)
        );

        onChange(lat, lng);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 16,
            duration: 1000,
          });
          setMarker(mapRef.current, lat, lng);
        }

        setLocating(false);
      },
      (error) => {
        console.error(error);

        let message = "GPS-locatie kon niet worden bepaald.";
        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Locatietoegang is geweigerd. Geef BlueLog toestemming om je locatie te gebruiken.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Je huidige GPS-locatie is niet beschikbaar.";
        } else if (error.code === error.TIMEOUT) {
          message = "Het bepalen van je GPS-locatie duurde te lang.";
        }

        setGpsError(message);
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

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
      const lng = Number(event.lngLat.lng.toFixed(6));
      const lat = Number(event.lngLat.lat.toFixed(6));

      onChange(lat, lng);
      setMarker(map, lat, lng);
    });

    if (longitude !== 0 && latitude !== 0) {
      setMarker(map, latitude, longitude);
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (latitude === 0 && longitude === 0) return;

    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 15,
      duration: 1000,
    });

    setMarker(
      mapRef.current,
      latitude,
      longitude
    );
  }, [latitude, longitude]);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">
          Locatie kiezen
        </h2>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
        >
          {locating
            ? "📍 GPS-locatie bepalen..."
            : "📍 Gebruik mijn huidige GPS-locatie"}
        </button>
      </div>

      {gpsError && (
        <div className="mb-4 rounded-lg border border-amber-500/50 bg-amber-950/30 p-3 text-sm text-amber-300">
          {gpsError}
        </div>
      )}

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
        Kies een bekende duikstek, gebruik je huidige GPS-locatie of tik op de
        kaart. De pin kun je daarna verslepen voor de exacte duiklocatie.
      </p>
    </div>
  );
}
