#!/usr/bin/env bash
set -euo pipefail
cd "${1:-$(pwd)}"

test -f package.json || { echo "Voer dit uit in /workspaces/BlueLog"; exit 1; }

echo "1/2 Supabase Storage upload API maken..."

mkdir -p app/api/upload

cat > app/api/upload/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "dive-photos";
const MAX_FILE_SIZE = 4 * 1024 * 1024;

function safeExtension(file: File) {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return byType[file.type] ?? "jpg";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData
      .getAll("photos")
      .filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Geen foto's ontvangen." },
        { status: 400 }
      );
    }

    const uploaded = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `${file.name} is geen afbeelding.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error:
              `${file.name} is na verkleinen nog te groot. ` +
              "Probeer een kleinere foto.",
          },
          { status: 413 }
        );
      }

      const extension = safeExtension(file);
      const now = new Date();
      const folder =
        `${now.getUTCFullYear()}/` +
        `${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

      const filename = `${crypto.randomUUID()}.${extension}`;
      const path = `${folder}/${filename}`;

      const bytes = new Uint8Array(await file.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Storage upload fout:", uploadError);

        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data: publicData } = supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(path);

      uploaded.push({
        filename,
        originalName: file.name,
        path: publicData.publicUrl,
        storagePath: path,
        size: file.size,
      });
    }

    return NextResponse.json({ photos: uploaded });
  } catch (error) {
    console.error("Foto-upload fout:", error);

    return NextResponse.json(
      { error: "Foto upload mislukt." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const url = String(body?.url ?? "");

    if (!url) {
      return NextResponse.json(
        { error: "Foto-URL ontbreekt." },
        { status: 400 }
      );
    }

    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const index = url.indexOf(marker);

    if (index === -1) {
      return new NextResponse(null, { status: 204 });
    }

    const encodedPath = url.slice(index + marker.length);
    const storagePath = decodeURIComponent(encodedPath);

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error("Foto verwijderen fout:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Foto verwijderen fout:", error);

    return NextResponse.json(
      { error: "Foto verwijderen mislukt." },
      { status: 500 }
    );
  }
}
EOF

echo "2/2 FotoUploader aanpassen..."

cat > components/photos/PhotoUploader.tsx <<'EOF'
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
const MAX_ORIGINAL_SIZE = 15 * 1024 * 1024;
const TARGET_MAX_BYTES = 3 * 1024 * 1024;
const MAX_IMAGE_EDGE = 2200;

async function compressImage(file: File): Promise<File> {
  if (file.size <= TARGET_MAX_BYTES) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(
      1,
      MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height)
    );

    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.82);
    });

    if (!blob) {
      return file;
    }

    const baseName =
      file.name.replace(/\.[^.]+$/, "") || "duikfoto";

    return new File(
      [blob],
      `${baseName}.jpg`,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );
  } catch (error) {
    console.warn("Foto kon niet worden verkleind:", error);
    return file;
  }
}

export default function PhotoUploader({
  photos,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);

  const [selectedPhoto, setSelectedPhoto] =
    useState<string | null>(null);

  async function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (photos.length + selectedFiles.length > MAX_PHOTOS) {
      alert("Je kunt maximaal 10 foto's toevoegen.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    const tooLarge = selectedFiles.find(
      (file) => file.size > MAX_ORIGINAL_SIZE
    );

    if (tooLarge) {
      alert(
        `${tooLarge.name} is groter dan 15 MB. ` +
          "Kies een kleinere foto."
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    const newUrls: string[] = [];

    try {
      setUploading(true);

      for (const originalFile of selectedFiles) {
        const file = await compressImage(originalFile);

        if (file.size > 4 * 1024 * 1024) {
          throw new Error(
            `${originalFile.name} kon niet voldoende worden verkleind.`
          );
        }

        const formData = new FormData();
        formData.append("photos", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error || "Upload mislukt."
          );
        }

        const uploaded = data as {
          photos: UploadedPhoto[];
        };

        newUrls.push(
          ...uploaded.photos.map((photo) => photo.path)
        );
      }

      onChange([
        ...photos,
        ...newUrls,
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
        inputRef.current.value = "";
      }
    }
  }

  async function removePhoto(index: number) {
    const photo = photos[index];

    const confirmed = window.confirm(
      "Deze foto verwijderen?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: photo }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || "Foto verwijderen mislukt."
        );
      }

      const updated = [...photos];
      updated.splice(index, 1);

      onChange(updated);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Foto verwijderen mislukt."
      );
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          📷 Foto&apos;s
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
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {photos.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-700 py-12 text-center text-slate-500">
          Nog geen foto&apos;s toegevoegd.
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
        {photos.length} / 10 foto&apos;s
      </p>

      <p className="text-sm text-slate-500">
        JPG, PNG en WEBP • maximaal 15 MB per originele foto
      </p>

      <p className="text-sm text-slate-500">
        Grote foto&apos;s worden automatisch verkleind voor opslag.
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
EOF

npm run build

echo
echo "KLAAR."
echo "Push daarna met:"
echo "git add app/api/upload/route.ts components/photos/PhotoUploader.tsx"
echo "git commit -m 'Add Supabase dive photo storage'"
echo "git push"
