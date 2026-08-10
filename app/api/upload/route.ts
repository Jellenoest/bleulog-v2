import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "dive-photos";
const MAX_FILE_SIZE = 4 * 1024 * 1024;

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

    const uploadedPhotos = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `${file.name} is geen afbeelding.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name} is te groot.` },
          { status: 413 }
        );
      }

      const extension =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";

      const date = new Date();

      const folder =
        `${date.getUTCFullYear()}/` +
        `${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

      const filename =
        `${crypto.randomUUID()}.${extension}`;

      const storagePath =
        `${folder}/${filename}`;

      const bytes =
        new Uint8Array(
          await file.arrayBuffer()
        );

      const { error } =
        await supabaseAdmin.storage
          .from(BUCKET)
          .upload(
            storagePath,
            bytes,
            {
              contentType: file.type,
              cacheControl: "3600",
              upsert: false,
            }
          );

      if (error) {
        console.error(error);

        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      const { data } =
        supabaseAdmin.storage
          .from(BUCKET)
          .getPublicUrl(storagePath);

      uploadedPhotos.push({
        filename,
        originalName: file.name,
        path: data.publicUrl,
        size: file.size,
      });
    }

    return NextResponse.json({
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error(
      "Foto upload fout:",
      error
    );

    return NextResponse.json(
      { error: "Foto upload mislukt." },
      { status: 500 }
    );
  }
}
