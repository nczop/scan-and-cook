import { RecipeCard } from "@/components/RecipeCard";
import { RecipesTitleSearch } from "@/components/RecipesTitleSearch";
import { ScanAndCookLogo } from "@/components/ScanAndCookLogo";
import { Button } from "@/components/ui/button";
import { displayRecipeSource } from "@/lib/recipes/displaySource";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function sanitizeIlikeFragment(fragment: string): string {
  return fragment.trim().replace(/[%_\\]/g, "");
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const titleFragment = sanitizeIlikeFragment(rawQ ?? "");

  const supabase = await createClient();
  let query = supabase.from("recipes").select("*");
  if (titleFragment.length > 0) {
    query = query.ilike("title", `%${titleFragment}%`);
  }
  const { data: rows, error } = await query.order("created_at", {
    ascending: false,
  });

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
      <Suspense
        fallback={
          <div
            className="mb-6 h-9 max-w-md rounded-lg border border-foreground/22 bg-card shadow-sm dark:border-white/28 dark:bg-card dark:shadow-black/20"
            aria-hidden
          />
        }
      >
        <RecipesTitleSearch initialQuery={rawQ?.trim() ?? ""} />
      </Suspense>
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">
          {titleFragment.length > 0
            ? "Nie znaleziono przepisów o takim tytule."
            : "Nie masz jeszcze żadnych przepisów."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
