"use client";

import { createClient, isSupabaseConfigured } from "./client";

const BUCKET = "portfolio-assets";

export async function uploadFile(
  file: File,
  path: string
): Promise<string | null> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase לא מוגדר. בדוק .env.local");
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("נדרשת התחברות. התחבר מחדש ב-Admin.");
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return urlData?.publicUrl ?? null;
}
