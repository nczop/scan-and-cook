import { notFound } from "next/navigation";
import { RecipeDetail } from "@/components/RecipeDetail";
import { displayRecipeSource } from "@/lib/recipes/displaySource";
import { createClient } from "@/lib/supabase/server";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  const recipe = {
    id: row.id,
    title: row.title,
    ingredients: row.ingredients,
    steps: row.steps,
    notes: row.notes,
    isSeed: row.is_seed,
    source: displayRecipeSource({
      is_seed: row.is_seed,
      source_image_url: row.source_image_url,
      entry_source: row.entry_source,
    }),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <RecipeDetail recipe={recipe} />
      </div>
    </div>
  );
}
