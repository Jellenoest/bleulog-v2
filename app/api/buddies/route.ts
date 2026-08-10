import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const fromRow = (r: any) => ({ ...(r.payload ?? {}), id: r.id });

export async function GET() {
  const { data, error } = await supabaseAdmin.from("buddies").select("*").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(fromRow));
}

export async function POST(request: Request) {
  const buddy = await request.json();
  const id = crypto.randomUUID();
  const { data, error } = await supabaseAdmin.from("buddies").insert({ id, payload: { ...buddy, id } }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(fromRow(data), { status: 201 });
}
