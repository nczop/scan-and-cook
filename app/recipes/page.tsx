import { RecipeCard } from "@/components/RecipeCard";
import { createClient } from "@/lib/supabase/server";

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
    source: row.source_image_url ? ("scan" as const) : undefined,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-medium">Moje przepisy</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
