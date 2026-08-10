import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().replace(/[%_,]/g, "");
  if (!q) return NextResponse.json([]);
  const { data, error } = await supabaseAdmin.from("dive_sites").select("*")
    .or(`name.ilike.%${q}%,region.ilike.%${q}%,country.ilike.%${q}%`).order("country").order("name").limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((s) => ({
    id: s.id, code: s.code, name: s.name, country: s.country, countryCode: s.country_code,
    region: s.region, latitude: s.latitude, longitude: s.longitude, waterType: s.water_type,
    entryType: s.entry_type, difficulty: s.difficulty, maxDepth: s.max_depth, description: s.description,
  })));
}
