import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { displayRecipeSource } from "@/lib/recipes/displaySource";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function RecipesPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }
  const recipes = (rows ?? []).map((row) => ({
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
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl">Moje przepisy</h1>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus />
            Dodaj przepis
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
