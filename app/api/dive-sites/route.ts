import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("dive_sites").select("*").order("country").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((s) => ({
    id: s.id, code: s.code, name: s.name, country: s.country, countryCode: s.country_code,
    region: s.region, latitude: s.latitude, longitude: s.longitude, waterType: s.water_type,
    entryType: s.entry_type, difficulty: s.difficulty, maxDepth: s.max_depth, description: s.description,
  })));
}
