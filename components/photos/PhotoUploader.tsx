"use client";

import { useRef, useState } from "react";

type UploadedPhoto = {
  filename: string;
  originalName: string;
  path: string;
  size: number;
};

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
};

export default function PhotoUploader({
  photos,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [selectedPhoto, setSelectedPhoto] =
    useState<string | null>(null);

  async function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    if (photos.length + files.length > 10) {
      alert(
        "Je kunt maximaal 10 foto's toevoegen."
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("photos", file);
    });

    try {
      setUploading(true);

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload mislukt.");
      }

      const data: {
        photos: UploadedPhoto[];
      } = await response.json();

      onChange([
        ...photos,
        ...data.photos.map(
          (photo) => photo.path
        ),
      ]);
    } catch (error) {
      console.error(error);

      alert("Foto upload mislukt.");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removePhoto(index: number) {
    const updated = [...photos];

    updated.splice(index, 1);

    onChange(updated);
  }

  return (
    <div>

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          📷 Foto's
        </h2>

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={uploading}
          className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
        >
          {uploading
            ? "Uploaden..."
            : "Foto's kiezen"}
        </button>

      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {photos.length === 0 ? (

        <div className="rounded-xl border-2 border-dashed border-slate-700 py-12 text-center text-slate-500">
          Nog geen foto's toegevoegd.
        </div>

      ) : (

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {photos.map((photo, index) => (

            <div
              key={`${photo}-${index}`}
              className="group relative overflow-hidden rounded-xl border border-slate-700"
            >

              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                onClick={() =>
                  setSelectedPhoto(photo)
                }
                className="h-48 w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
              />

              <button
                type="button"
                onClick={() =>
                  removePhoto(index)
                }
                className="absolute right-2 top-2 rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
              >
                ✕
              </button>

            </div>

          ))}

        </div>

      )}

      <p className="mt-5 text-sm text-slate-500">
        {photos.length} / 10 foto's
      </p>

      <p className="text-sm text-slate-500">
        JPG, PNG en WEBP • maximaal 15 MB per foto
      </p>

      {selectedPhoto && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-8"
          onClick={() =>
            setSelectedPhoto(null)
          }
        >

          <img
            src={selectedPhoto}
            alt="Foto"
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
          />

        </div>

      )}

    </div>
  );
}