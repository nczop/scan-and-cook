import { RecipeCard } from "@/components/RecipeCard";
import { ScanAndCookLogo } from "@/components/ScanAndCookLogo";
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
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <Link
            href="/"
            className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl outline-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring md:size-18"
            aria-label="Strona główna"
          >
            <ScanAndCookLogo className="size-14 md:size-18" />
          </Link>
          <h1 className="text-2xl">Moje przepisy</h1>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus />
            Dodaj
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
