"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { NewRecipeChoice } from "@/components/NewRecipeChoice";
import { RecipeForm } from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Recipe } from "@/lib/schemas/recipe";

function isManualMode(searchParams: URLSearchParams) {
  return (
    searchParams.get("mode") === "manual" ||
    searchParams.get("manual") === "true"
  );
}

/**
 * Strona /recipes/new — logika kliencka.
 *
 * Stany na jednym URL:
 * 1. Choice — brak trybu manual i brak wyniku skanu
 * 2. Parsing — fetch do /api/parse-recipe
 * 3. Form — po skanie (defaultValues + fromScan) albo ręcznie (?mode=manual lub ?manual=true)
 */
export function NewRecipePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manual = isManualMode(searchParams);

  const [parsing, setParsing] = useState(false);
  const [parsedRecipe, setParsedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScanFile = async (file: File) => {
    setParsing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/parse-recipe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          body?.error ?? "Nie udało się odczytać przepisu z tego zdjęcia."
        );
      }

      const data: Recipe = await res.json();
      setParsedRecipe(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Coś poszło nie tak. Spróbuj ponownie."
      );
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async (data: Recipe, entrySource: "manual" | "scan") => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSubmitError(
          "Brak sesji — odśwież stronę i spróbuj ponownie zapisać przepis."
        );
        return;
      }

      const baseRow = {
        user_id: user.id,
        title: data.title,
        ingredients: data.ingredients,
        steps: data.steps,
        notes: data.notes,
        is_seed: false,
      };

      let { data: row, error: insertError } = await supabase
        .from("recipes")
        .insert({ ...baseRow, entry_source: entrySource })
        .select("id")
        .single();

      // Baza bez migracji `20260530120000_recipes_entry_source.sql` — PostgREST nie zna kolumny.
      if (
        insertError?.message.includes("entry_source") ||
        insertError?.message.includes("schema cache")
      ) {
        ({ data: row, error: insertError } = await supabase
          .from("recipes")
          .insert(baseRow)
          .select("id")
          .single());
      }

      if (insertError) {
        setSubmitError(insertError.message);
        return;
      }

      if (!row) {
        setSubmitError("Brak danych po zapisie — spróbuj ponownie.");
        return;
      }

      router.push(`/recipes/${row.id}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (parsing) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-base font-semibold">Claude czyta przepis…</p>
        <p className="mt-1 text-sm text-muted-foreground">
          To zajmie kilka sekund. Nie zamykaj strony.
        </p>
      </div>
    );
  }

  if (parsedRecipe) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {submitError && (
          <div
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {submitError}
          </div>
        )}
        <RecipeForm
          defaultValues={parsedRecipe}
          fromScan
          onSubmit={(d) => handleSave(d, "scan")}
          onCancel={() => setParsedRecipe(null)}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  if (manual) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {submitError && (
          <div
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {submitError}
          </div>
        )}
        <RecipeForm
          onSubmit={(d) => handleSave(d, "manual")}
          onCancel={() => router.push("/recipes/new")}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mx-auto mb-4 flex max-w-3xl flex-col gap-3 rounded-md border border-destructive/20 bg-destructive/5 p-3 sm:flex-row sm:items-start">
          <div className="flex flex-1 gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Możesz spróbować jeszcze raz albo{" "}
                <Link
                  href="/recipes/new?mode=manual"
                  className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
                >
                  dodać przepis ręcznie
                </Link>
                .
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 self-end sm:self-start"
            onClick={() => setError(null)}
          >
            Zamknij
          </Button>
        </div>
      )}
      <NewRecipeChoice onScanFile={handleScanFile} />
    </>
  );
}
