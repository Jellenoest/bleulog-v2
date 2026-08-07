"use client";

import { Dive } from "@/server/types/dive";

import BasicInfoSection from "./BasicInfoSection";
import DiveInfoSection from "./DiveInfoSection";
import EquipmentSection from "./EquipmentSection";
import DiveOptionsSection from "./DiveOptionsSection";
import NotesSection from "./NotesSection";

import LocationPicker from "@/components/maps/LocationPicker";

type Props = {
  dive: Dive;
  onChange: (dive: Dive) => void;
};

export default function DiveForm({
  dive,
  onChange,
}: Props) {
  return (
    <div className="space-y-8">

      <BasicInfoSection
        dive={dive}
        onChange={onChange}
      />

      <LocationPicker
        latitude={dive.latitude}
        longitude={dive.longitude}
        onChange={(latitude, longitude) =>
          onChange({
            ...dive,
            latitude,
            longitude,
          })
        }
      />

      <DiveInfoSection
        dive={dive}
        onChange={onChange}
      />

      <EquipmentSection
        dive={dive}
        onChange={onChange}
      />

      <DiveOptionsSection
        dive={dive}
        onChange={onChange}
      />

      <NotesSection
        dive={dive}
        onChange={onChange}
      />

    </div>
  );
}