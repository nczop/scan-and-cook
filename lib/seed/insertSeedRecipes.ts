import type { SupabaseClient } from "@supabase/supabase-js";

import { SEED_RECIPES } from "@/lib/seed/recipes";

export async function insertSeedRecipesIfEmpty(
  supabase: SupabaseClient,
  userId: string
): Promise<{ error: Error | null }> {
  const { count, error: countError } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    return { error: countError };
  }

  if (count != null && count > 0) {
    return { error: null };
  }

  const rows = SEED_RECIPES.map(({ isSeed: _isSeed, ...recipe }) => ({
    user_id: userId,
    title: recipe.title,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    notes: recipe.notes,
    is_seed: true,
  }));

  const { error: insertError } = await supabase.from("recipes").insert(rows);

  if (insertError) {
    return { error: insertError };
  }

  return { error: null };
}
