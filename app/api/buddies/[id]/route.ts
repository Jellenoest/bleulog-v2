import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const patch = await request.json();
  const { data: current, error: getError } = await supabaseAdmin.from("buddies").select("payload").eq("id", id).single();
  if (getError) return NextResponse.json({ error: getError.message }, { status: 404 });
  const payload = { ...(current?.payload ?? {}), ...patch, id };
  const { data, error } = await supabaseAdmin.from("buddies").update({ payload, updated_at: new Date().toISOString() }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...(data.payload ?? {}), id: data.id });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { error } = await supabaseAdmin.from("buddies").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
