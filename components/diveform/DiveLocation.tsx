"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Map, {
  Marker,
  NavigationControl,
  MapRef,
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  latitude: number;
  longitude: number;
  onLatitudeChange: (value: number) => void;
  onLongitudeChange: (value: number) => void;
  onCurrentLocation: () => void;
};

export default function DiveLocation({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  onCurrentLocation,
}: Props) {

  const mapRef =
    useRef<MapRef>(null);

  const [viewState, setViewState] =
    useState({
      latitude:
        latitude !== 0
          ? latitude
          : 52.1326,

      longitude:
        longitude !== 0
          ? longitude
          : 5.2913,

      zoom:
        latitude !== 0
          ? 13
          : 7,
    });

  const hasLocation = useMemo(
    () =>
      latitude !== 0 &&
      longitude !== 0,
    [latitude, longitude]
  );
    useEffect(() => {
    if (!mapRef.current) return;

    if (!hasLocation) return;

    setViewState({
      latitude,
      longitude,
      zoom: 13,
    });

    mapRef.current.flyTo({
      center: [
        longitude,
        latitude,
      ],
      zoom: 13,
      duration: 1000,
    });
  }, [
    latitude,
    longitude,
    hasLocation,
  ]);

  function updateLocation(
    lat: number,
    lng: number
  ) {
    onLatitudeChange(
      Number(lat.toFixed(6))
    );

    onLongitudeChange(
      Number(lng.toFixed(6))
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block">
            Breedtegraad
          </label>

          <input
            type="number"
            step="0.000001"
            value={latitude}
            onChange={(e) =>
              updateLocation(
                Number(e.target.value),
                longitude
              )
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />

        </div>

        <div>

          <label className="mb-2 block">
            Lengtegraad
          </label>

          <input
            type="number"
            step="0.000001"
            value={longitude}
            onChange={(e) =>
              updateLocation(
                latitude,
                Number(e.target.value)
              )
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />

        </div>

      </div>

      <button
        type="button"
        onClick={onCurrentLocation}
        className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold hover:bg-emerald-500"
      >
        📍 Gebruik huidige locatie
      </button>
            <div
        className="overflow-hidden rounded-xl border border-slate-700"
        style={{ height: 450 }}
      >
        <Map
          ref={mapRef}
          {...viewState}
          maxZoom={20}
minZoom={2}
reuseMaps
          onMove={(evt) =>
            setViewState(evt.viewState)
          }
          mapStyle={`https://api.maptiler.com/maps/satellite/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
          style={{
            width: "100%",
            height: "100%",
          }}
          onClick={(event) => {
            updateLocation(
              event.lngLat.lat,
              event.lngLat.lng
            );
          }}
        >
         <NavigationControl
  position="top-right"
/>

          {hasLocation && (
            <Marker
              latitude={latitude}
              longitude={longitude}
              anchor="center"
              draggable
              onDragEnd={(event) => {
                updateLocation(
                  event.lngLat.lat,
                  event.lngLat.lng
                );
              }}
            >
             <div className="cursor-grab text-5xl drop-shadow-lg">
    📍
</div>
            </Marker>
          )}

        </Map>

      </div>
            {hasLocation && (
        <div className="rounded-lg border border-emerald-600 bg-emerald-900/20 p-4">

          <p className="font-semibold text-emerald-400">
            ✓ GPS-locatie geselecteerd
          </p>

          <p className="mt-2 text-sm text-slate-300">
            Latitude: {latitude.toFixed(6)}
          </p>

          <p className="text-sm text-slate-300">
            Longitude: {longitude.toFixed(6)}
          </p>

        </div>
      )}

    </div>
  );
}