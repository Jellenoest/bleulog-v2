import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "certificate-cards";

async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const { id } = await context.params;

  const { data: certificate, error: findError } = await supabaseAdmin
    .from("certificates")
    .select("id, image_storage_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });
  if (!certificate) return NextResponse.json({ error: "Certificaat niet gevonden." }, { status: 404 });

  if (certificate.image_storage_path) {
    const { error: storageError } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove([certificate.image_storage_path]);
    if (storageError) console.error(storageError);
  }

  const { error: deleteError } = await supabaseAdmin
    .from("certificates")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
