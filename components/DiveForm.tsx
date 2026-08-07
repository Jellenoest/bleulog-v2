"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { Dive } from "@/server/types/dive";

import { Buddy, getBuddies } from "@/lib/buddyApi";

import {
  saveDive,
  updateDive,
  getDives,
} from "@/lib/storage";

import DiveLocation from "@/components/diveform/DiveLocation";

import GeneralSection from "@/components/diveform/GeneralSection";
import DiveSection from "@/components/diveform/DiveSection";
import EquipmentSection from "@/components/diveform/EquipmentSection";
import PhotoSection from "@/components/diveform/PhotoSection";
import NotesSection from "@/components/diveform/NotesSection";
import ButtonsSection from "@/components/diveform/ButtonsSection";

type DiveFormProps = {
  mode: "new" | "edit";
  initialDive?: Dive;
};

export default function DiveForm({
  mode,
  initialDive,
}: DiveFormProps) {
  const router = useRouter();

  const [saving, setSaving] =
    useState(false);

    const [buddies, setBuddies] =
  useState<Buddy[]>([]);

  const [form, setForm] =
    useState<Dive>(
      initialDive ?? {
        id: "",
        diveNumber: 1,

        date: "",
        location: "",
        country: "",
        buddy: "",

        latitude: 0,
        longitude: 0,

        diveType: "Boot",

        nightDive: false,
        driftDive: false,
        altitudeDive: false,

        maxDepth: 0,
        averageDepth: 0,

        duration: 0,
        safetyStop: 0,

        waterType: "Zout",
        waterTemperature: 0,
        visibility: 0,
        current: "",

        weight: 0,

        suit: "",
        cylinder: "",
        gas: "Lucht",

        startPressure: 0,
        endPressure: 0,

        airConsumption: 0,

        notes: "",

        photos: [],
      }
    );

 useEffect(() => {
  async function loadData() {

    const buddyList = await getBuddies();
    setBuddies(buddyList);

    if (mode === "new") {

      const dives = await getDives();

      const nextNumber =
        dives.length > 0
          ? Math.max(
              ...dives.map(
                (d) => d.diveNumber
              )
            ) + 1
          : 1;

      setForm((prev) => ({
        ...prev,
        diveNumber: nextNumber,
      }));
    }
  }

  loadData();
  }, [mode]);

   function handleChange(
    e: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked =
        (e.target as HTMLInputElement).checked;

      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: Number(value),
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePhotosChange(
    photos: string[]
  ) {
    setForm((prev) => ({
      ...prev,
      photos,
    }));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocatie wordt niet ondersteund.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: Number(
            position.coords.latitude.toFixed(6)
          ),
          longitude: Number(
            position.coords.longitude.toFixed(6)
          ),
        }));
      },
      () => {
        alert(
          "Kon huidige locatie niet bepalen."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    try {
      setSaving(true);

      if (mode === "new") {
        await saveDive({
          ...form,
          id: crypto.randomUUID(),
        });
      } else {
        await updateDive(form);
      }

      router.push("/dives");
    } catch (error) {
      console.error(error);
      alert("Opslaan mislukt.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10 rounded-xl border border-slate-700 bg-slate-900 p-8"
    >
<GeneralSection
  form={form}
  buddies={buddies}
  onChange={handleChange}
  onLocationSelect={(site) =>
    setForm((prev) => ({
      ...prev,
      location: site.name,
      country: site.country,
      latitude: site.latitude,
      longitude: site.longitude,
    }))
  }
/>
      <DiveLocation
        latitude={form.latitude}
        longitude={form.longitude}
        onLatitudeChange={(latitude) =>
          setForm((prev) => ({
            ...prev,
            latitude,
          }))
        }
        onLongitudeChange={(longitude) =>
          setForm((prev) => ({
            ...prev,
            longitude,
          }))
        }
        onCurrentLocation={
          useCurrentLocation
        }
      />

      <DiveSection
        form={form}
        onChange={handleChange}
      />

      <EquipmentSection
        form={form}
        onChange={handleChange}
      />

      <PhotoSection
        form={form}
        onPhotosChange={
          handlePhotosChange
        }
      />

      <NotesSection
        form={form}
        onChange={handleChange}
      />

<ButtonsSection
  saving={saving}
  onSave={() => {}}
  onCancel={() => router.push("/dives")}
/>

    </form>
  );
}