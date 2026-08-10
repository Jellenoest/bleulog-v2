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

const MAX_PHOTOS = 10;
const MAX_ORIGINAL_SIZE =
  15 * 1024 * 1024;

const MAX_UPLOAD_SIZE =
  3 * 1024 * 1024;

const MAX_IMAGE_EDGE = 2200;

async function compressImage(
  file: File
): Promise<File> {
  if (file.size <= MAX_UPLOAD_SIZE) {
    return file;
  }

  const bitmap =
    await createImageBitmap(file);

  const scale = Math.min(
    1,
    MAX_IMAGE_EDGE /
      Math.max(
        bitmap.width,
        bitmap.height
      )
  );

  const width = Math.round(
    bitmap.width * scale
  );

  const height = Math.round(
    bitmap.height * scale
  );

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    return file;
  }

  context.drawImage(
    bitmap,
    0,
    0,
    width,
    height
  );

  bitmap.close();

  const blob =
    await new Promise<Blob | null>(
      (resolve) => {
        canvas.toBlob(
          resolve,
          "image/jpeg",
          0.82
        );
      }
    );

  if (!blob) {
    return file;
  }

  const name =
    file.name.replace(
      /\.[^.]+$/,
      ""
    ) || "duikfoto";

  return new File(
    [blob],
    `${name}.jpg`,
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );
}

export default function PhotoUploader({
  photos,
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [uploading, setUploading] =
    useState(false);

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] =
    useState<string | null>(null);

  async function handleFiles(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles =
      Array.from(
        event.target.files ?? []
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    if (
      photos.length +
        selectedFiles.length >
      MAX_PHOTOS
    ) {
      alert(
        "Je kunt maximaal 10 foto's toevoegen."
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    const tooLarge =
      selectedFiles.find(
        (file) =>
          file.size >
          MAX_ORIGINAL_SIZE
      );

    if (tooLarge) {
      alert(
        `${tooLarge.name} is groter dan 15 MB.`
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    const uploadedUrls:
      string[] = [];

    try {
      setUploading(true);

      for (
        const originalFile
        of selectedFiles
      ) {
        let file =
          originalFile;

        try {
          file =
            await compressImage(
              originalFile
            );
        } catch (error) {
          console.warn(
            "Verkleinen mislukt:",
            error
          );
        }

        if (
          file.size >
          4 * 1024 * 1024
        ) {
          throw new Error(
            `${originalFile.name} kon niet voldoende worden verkleind.`
          );
        }

        const formData =
          new FormData();

        formData.append(
          "photos",
          file
        );

        const response =
          await fetch(
            "/api/upload",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response
            .json()
            .catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ??
              "Foto upload mislukt."
          );
        }

        const result =
          data as {
            photos:
              UploadedPhoto[];
          };

        uploadedUrls.push(
          ...result.photos.map(
            (photo) =>
              photo.path
          )
        );
      }

      onChange([
        ...photos,
        ...uploadedUrls,
      ]);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Foto upload mislukt."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value =
          "";
      }
    }
  }

  function removePhoto(
    index: number
  ) {
    const updated =
      [...photos];

    updated.splice(
      index,
      1
    );

    onChange(updated);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          📷 Foto&apos;s
        </h2>

        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            inputRef.current?.click()
          }
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
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={
          handleFiles
        }
      />

      {photos.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-700 py-12 text-center text-slate-500">
          Nog geen foto&apos;s toegevoegd.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {photos.map(
            (
              photo,
              index
            ) => (
              <div
                key={`${photo}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-slate-700"
              >
                <img
                  src={
                    photo
                  }
                  alt={`Foto ${index + 1}`}
                  onClick={() =>
                    setSelectedPhoto(
                      photo
                    )
                  }
                  className="h-48 w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
                />

                <button
                  type="button"
                  onClick={() =>
                    removePhoto(
                      index
                    )
                  }
                  className="absolute right-2 top-2 rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                >
                  ✕
                </button>
              </div>
            )
          )}
        </div>
      )}

      <p className="mt-5 text-sm text-slate-500">
        {photos.length} / 10 foto&apos;s
      </p>

      <p className="text-sm text-slate-500">
        JPG, PNG en WEBP • maximaal 15 MB per originele foto
      </p>

      <p className="text-sm text-slate-500">
        Grote foto&apos;s worden automatisch verkleind.
      </p>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-8"
          onClick={() =>
            setSelectedPhoto(
              null
            )
          }
        >
          <img
            src={
              selectedPhoto
            }
            alt="Duikfoto"
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
