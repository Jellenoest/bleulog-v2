import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabase/server";

const PHOTO_BUCKET = "dive-photos";

function rowToDive(row: any) {
  return {
    ...(row.payload ?? {}),
    id: row.id,
    diveNumber: row.dive_number ?? row.payload?.diveNumber ?? 0,
    date: row.date ?? row.payload?.date ?? "",
    location: row.location ?? row.payload?.location ?? "",
    country: row.country ?? row.payload?.country ?? "",
    buddy: row.buddy ?? row.payload?.buddy ?? "",
    latitude: row.latitude ?? row.payload?.latitude ?? 0,
    longitude: row.longitude ?? row.payload?.longitude ?? 0,
  };
}

function photoStoragePath(url: unknown) {
  const value = String(url ?? "");
  const marker = `/storage/v1/object/public/${PHOTO_BUCKET}/`;
  const index = value.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(
    value.slice(index + marker.length)
  );
}

async function removePhotoUrls(urls: unknown[]) {
  const paths = urls
    .map(photoStoragePath)
    .filter((value): value is string => Boolean(value));

  if (paths.length === 0) return;

  const { error } = await supabaseAdmin.storage
    .from(PHOTO_BUCKET)
    .remove(paths);

  if (error) {
    console.error("Foto cleanup fout:", error);
  }
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("dives")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Duik niet gevonden." },
      { status: 404 }
    );
  }

  return NextResponse.json(rowToDive(data));
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const dive = await request.json();

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("dives")
    .select("payload")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: existingError.message },
      { status: 500 }
    );
  }

  if (!existing) {
    return NextResponse.json(
      { error: "Duik niet gevonden." },
      { status: 404 }
    );
  }

  const payload = {
    ...dive,
    id,
  };

  const { data, error } = await supabaseAdmin
    .from("dives")
    .update({
      dive_number: dive.diveNumber ?? 0,
      date: dive.date || null,
      location: dive.location ?? "",
      country: dive.country ?? "",
      buddy: dive.buddy ?? "",
      latitude: dive.latitude || null,
      longitude: dive.longitude || null,
      payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Duik niet gevonden." },
      { status: 404 }
    );
  }

  const oldPhotos = Array.isArray(existing.payload?.photos)
    ? existing.payload.photos
    : [];

  const newPhotos = Array.isArray(dive.photos)
    ? dive.photos
    : [];

  const removedPhotos = oldPhotos.filter(
    (photo: string) => !newPhotos.includes(photo)
  );

  await removePhotoUrls(removedPhotos);

  return new NextResponse(null, { status: 204 });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Niet ingelogd." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("dives")
    .select("payload")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: existingError.message },
      { status: 500 }
    );
  }

  if (!existing) {
    return NextResponse.json(
      { error: "Duik niet gevonden." },
      { status: 404 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("dives")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Duik niet gevonden." },
      { status: 404 }
    );
  }

  const photos = Array.isArray(existing.payload?.photos)
    ? existing.payload.photos
    : [];

  await removePhotoUrls(photos);

  return new NextResponse(null, { status: 204 });
}
