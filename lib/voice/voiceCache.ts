import { createHash } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export function voiceCacheKey({ text, provider, voiceName, language }: { text: string; provider: string; voiceName: string; language: string }) {
  return createHash("sha256").update(JSON.stringify({ text, provider, voiceName, language })).digest("hex");
}

export function textHash(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

export async function getVoiceCache(cacheKey: string) {
  if (process.env.VOICE_CACHE_ENABLED === "false") return null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("voice_cache")
    .select("*")
    .eq("cache_key", cacheKey)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!data) return null;
  await supabase.from("voice_cache").update({ hit_count: Number(data.hit_count ?? 0) + 1, updated_at: new Date().toISOString() }).eq("id", data.id);
  return data as { audio_url: string };
}

export async function saveVoiceCache({
  cacheKey,
  text,
  provider,
  voiceName,
  language,
  audioUrl,
}: {
  cacheKey: string;
  text: string;
  provider: string;
  voiceName: string;
  language: string;
  audioUrl: string;
}) {
  if (process.env.VOICE_CACHE_ENABLED === "false") return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const ttlDays = Number(process.env.AI_CACHE_TTL_DAYS || 30);
  await supabase.from("voice_cache").upsert(
    {
      cache_key: cacheKey,
      text_hash: textHash(text),
      provider,
      voice_name: voiceName,
      language,
      audio_url: audioUrl,
      expires_at: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "cache_key" },
  );
}
