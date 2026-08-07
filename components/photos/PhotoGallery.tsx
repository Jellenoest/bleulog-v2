"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";

type Props = {
  photos: string[];
};

export default function PhotoGallery({
  photos,
}: Props) {
  const [index, setIndex] = useState(-1);

  if (photos.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-700 py-12 text-center text-slate-500">
        Geen foto's toegevoegd.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <button
            key={`${photo}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className="overflow-hidden rounded-xl border border-slate-700 transition hover:border-cyan-500"
          >
            <img
              src={photo}
              alt={`Foto ${i + 1}`}
              className="h-52 w-full object-cover transition duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={photos.map((photo) => ({
          src: photo,
        }))}
      />
    </>
  );
}