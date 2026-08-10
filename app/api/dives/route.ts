import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const toDive = (row: any) => ({
  ...(row.payload ?? {}),
  id: row.id,
  diveNumber: row.dive_number ?? 0,
  date: row.date ?? "",
  location: row.location ?? "",
  country: row.country ?? "",
  buddy: row.buddy ?? "",
  latitude: row.latitude ?? 0,
  longitude: row.longitude ?? 0,
});

export async function GET() {
  const { data, error } = await supabaseAdmin.from("dives").select("*").order("dive_number", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(toDive));
}

export async function POST(request: Request) {
  const dive = await request.json();
  const { error } = await supabaseAdmin.from("dives").insert({
    id: dive.id,
    dive_number: dive.diveNumber ?? 0,
    date: dive.date || null,
    location: dive.location ?? "",
    country: dive.country ?? "",
    buddy: dive.buddy ?? "",
    latitude: dive.latitude || null,
    longitude: dive.longitude || null,
    payload: dive,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
