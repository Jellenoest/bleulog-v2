import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

function rowToCertificate(row: any) {
  return {
    id: row.id,
    organization: row.organization ?? "",
    certificateName: row.certificate_name ?? "",
    certificateNumber: row.certificate_number ?? "",
    achievedDate: row.achieved_date ?? "",
    expiryDate: row.expiry_date ?? "",
    notes: row.notes ?? "",
    imageUrl: row.image_url ?? "",
    imageStoragePath: row.image_storage_path ?? "",
    createdAt: row.created_at ?? "",
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(rowToCertificate));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const body = await request.json();
  const organization = String(body.organization ?? "").trim();
  const certificateName = String(body.certificateName ?? "").trim();

  if (!organization || !certificateName) {
    return NextResponse.json(
      { error: "Organisatie en certificaatnaam zijn verplicht." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("certificates")
    .insert({
      user_id: user.id,
      organization,
      certificate_name: certificateName,
      certificate_number: String(body.certificateNumber ?? "").trim(),
      achieved_date: body.achievedDate || null,
      expiry_date: body.expiryDate || null,
      notes: String(body.notes ?? "").trim(),
      image_url: String(body.imageUrl ?? ""),
      image_storage_path: String(body.imageStoragePath ?? ""),
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(rowToCertificate(data), { status: 201 });
}
