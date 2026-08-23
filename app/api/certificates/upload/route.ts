import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "certificate-cards";
const MAX_FILE_SIZE = 4 * 1024 * 1024;

async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Geen afbeelding ontvangen." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Bestand is geen afbeelding." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Afbeelding is groter dan 4 MB." }, { status: 413 });
  }

  const extension =
    file.type === "image/png" ? "png" :
    file.type === "image/webp" ? "webp" : "jpg";

  const storagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);
  return NextResponse.json({ url: data.publicUrl, storagePath });
}
