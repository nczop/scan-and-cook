"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RecipeForm } from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Recipe } from "@/lib/schemas/recipe";

interface EditRecipeFormClientProps {
  recipeId: string;
  initialRecipe: Recipe;
}

export function EditRecipeFormClient({
  recipeId,
  initialRecipe,
}: EditRecipeFormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (data: Recipe) => {
    setSaveError(null);
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("recipes")
        .update({
          title: data.title,
          ingredients: data.ingredients,
          steps: data.steps,
          notes: data.notes,
        })
        .eq("id", recipeId);

      if (error) {
        setSaveError(error.message);
        return;
      }

      router.push(`/recipes/${recipeId}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href={`/recipes/${recipeId}`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Wróć do przepisu
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="mb-1 text-xl">Edytuj przepis</h1>
        <p className="text-sm text-muted-foreground">
          Zmień treść i zapisz — data edycji zaktualizuje się automatycznie.
        </p>
      </div>

      {saveError && (
        <div
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {saveError}
        </div>
      )}

      <RecipeForm
        defaultValues={initialRecipe}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/recipes/${recipeId}`)}
        isSubmitting={isSubmitting}
        submitLabel="Zapisz zmiany"
      />
    </div>
  );
}
