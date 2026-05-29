import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipeSchema, type Recipe } from "@/lib/schemas/recipe";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { EditRecipeFormClient } from "./EditRecipeFormClient";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("recipes")
    .select("id, title, ingredients, steps, notes")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  const candidate: Recipe = {
    title: row.title,
    ingredients: row.ingredients as Recipe["ingredients"],
    steps: row.steps as Recipe["steps"],
    notes: row.notes ?? null,
  };

  const parsed = RecipeSchema.safeParse(candidate);
  if (!parsed.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-4 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <h1 className="text-lg text-destructive">
            Nie można wczytać przepisu do edycji
          </h1>
          <p className="text-sm text-muted-foreground">
            Dane w bazie nie pasują do oczekiwanego formatu. Skontaktuj się z
            administratorem albo dodaj przepis ponownie.
          </p>
          <Button asChild variant="outline">
            <Link href={`/recipes/${id}`}>Wróć do widoku</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <EditRecipeFormClient recipeId={row.id} initialRecipe={parsed.data} />
      </div>
    </div>
  );
}
