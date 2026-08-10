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

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { data, error } = await supabaseAdmin.from("dives").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "Niet gevonden" }, { status: 404 });
  return NextResponse.json(toDive(data));
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const dive = await request.json();
  const { error } = await supabaseAdmin.from("dives").update({
    dive_number: dive.diveNumber ?? 0,
    date: dive.date || null,
    location: dive.location ?? "",
    country: dive.country ?? "",
    buddy: dive.buddy ?? "",
    latitude: dive.latitude || null,
    longitude: dive.longitude || null,
    payload: { ...dive, id },
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { error } = await supabaseAdmin.from("dives").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
