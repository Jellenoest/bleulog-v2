import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("dives")
    .select("*")
    .order("dive_number", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    (data ?? []).map(rowToDive)
  );
}

export async function POST(request: Request) {
  const dive = await request.json();

  let diveNumber = Number(dive.diveNumber) || 0;

  // Als er geen geldig nummer is meegestuurd,
  // bepaal automatisch het volgende duiknummer.
  if (diveNumber <= 0) {
    const { data: lastDive, error: numberError } =
      await supabaseAdmin
        .from("dives")
        .select("dive_number")
        .order("dive_number", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (numberError) {
      return NextResponse.json(
        { error: numberError.message },
        { status: 500 }
      );
    }

    diveNumber =
      (Number(lastDive?.dive_number) || 0) + 1;
  }

  const payload = {
    ...dive,
    diveNumber,
  };

  const { error } = await supabaseAdmin
    .from("dives")
    .insert({
      id: dive.id,
      dive_number: diveNumber,
      date: dive.date || null,
      location: dive.location ?? "",
      country: dive.country ?? "",
      buddy: dive.buddy ?? "",
      latitude: dive.latitude || null,
      longitude: dive.longitude || null,
      payload,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}