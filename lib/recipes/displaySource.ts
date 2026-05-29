/**
 * Mapowanie wiersza `recipes` → pole `source` na karcie / szczegółach.
 * Przykłady (seed) nie dostają etykiety manual/scan — tylko badge „Przykład”.
 */
export function displayRecipeSource(row: {
  is_seed: boolean;
  source_image_url?: string | null;
  entry_source?: string | null;
}): "manual" | "scan" | undefined {
  if (row.is_seed) return undefined;
  if (row.entry_source === "scan" || row.source_image_url) return "scan";
  return "manual";
}
