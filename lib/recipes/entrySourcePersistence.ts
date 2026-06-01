/**
 * Gdy w projekcie Supabase nie ma jeszcze kolumny `entry_source` (lub cache
 * schematu PostgREST jest nieaktualny), zapis z `entry_source: "scan"` się nie
 * uda. Wtedy drugi insert i tak musi zapamiętać, że przepis przyszedł z AI —
 * używamy istniejącej kolumny `source_image_url` (MVP nie pokazuje jej w UI).
 */
export const RECIPE_AI_ENTRY_FALLBACK_MARKER =
  "snc-internal:recipe-from-ai-scan" as const;

/** Czy błąd oznacza „kolumny `entry_source` nie ma / API jej nie widzi”. */
export function isMissingEntrySourceColumnError(error: {
  message?: string;
} | null): boolean {
  const msg = error?.message;
  if (!msg?.includes("entry_source")) return false;
  const lower = msg.toLowerCase();
  return (
    lower.includes("schema cache") ||
    lower.includes("could not find") ||
    lower.includes("does not exist") ||
    lower.includes("unknown column")
  );
}
