"use client";

import { Dive } from "@/server/types/dive";
import PhotoUploader from "@/components/photos/PhotoUploader";

type Props = {
  form: Dive;
  onPhotosChange: (photos: string[]) => void;
};

export default function PhotoSection({
  form,
  onPhotosChange,
}: Props) {
  return (
    <div>

      <h2 className="mb-6 text-2xl font-bold">
        Foto's
      </h2>

      <PhotoUploader
        photos={form.photos}
        onChange={onPhotosChange}
      />

    </div>
  );
}