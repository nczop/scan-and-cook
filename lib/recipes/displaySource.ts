/**
 * Mapowanie wiersza `recipes` → pole `source` na karcie / szczegółach.
 * Przykłady (seed) nie dostają etykiety manual/ai — tylko badge „Przykład”.
 * - `entry_source === "scan"` — zapis po skanie AI
 * - niepusty `source_image_url` — zdjęcie źródłowe lub znacznik fallbacku AI
 *   (patrz `RECIPE_AI_ENTRY_FALLBACK_MARKER` w `entrySourcePersistence.ts`)
 */
export function displayRecipeSource(row: {
  is_seed: boolean;
  source_image_url?: string | null;
  entry_source?: string | null;
}): "manual" | "ai" | undefined {
  if (row.is_seed) return undefined;
  const src = row.entry_source?.trim();
  if (src === "scan" || Boolean(row.source_image_url?.trim())) {
    return "ai";
  }
  return "manual";
}
