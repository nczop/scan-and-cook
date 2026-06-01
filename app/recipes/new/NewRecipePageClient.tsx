"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { NewRecipeChoice } from "@/components/NewRecipeChoice";
import { RecipeForm } from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import {
  isMissingEntrySourceColumnError,
  RECIPE_AI_ENTRY_FALLBACK_MARKER,
} from "@/lib/recipes/entrySourcePersistence";
import { createClient } from "@/lib/supabase/client";
import type { Recipe } from "@/lib/schemas/recipe";

type ParseResult = {
  transcript: string;
  recipe: Recipe;
  imageDataUrl: string;
};

export default function NewRecipePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manual = searchParams.get("mode") === "manual";

  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScanFile = async (file: File) => {
    setParsing(true);
    setError(null);

    try {
      // Czytamy plik lokalnie do data URL (do preview) RÓWNOLEGLE z fetchem do API.
      const [imageDataUrl, apiResult] = await Promise.all([
        fileToDataUrl(file),
        sendToParseEndpoint(file),
      ]);

      setParseResult({
        transcript: apiResult.transcript,
        recipe: apiResult.recipe,
        imageDataUrl,
      });
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

      let { data: row, error: insertError } =
        entrySource === "scan"
          ? await supabase
              .from("recipes")
              .insert({
                ...baseRow,
                entry_source: entrySource,
                source_image_url: RECIPE_AI_ENTRY_FALLBACK_MARKER,
              })
              .select("id")
              .single()
          : await supabase
              .from("recipes")
              .insert({ ...baseRow, entry_source: entrySource })
              .select("id")
              .single();
      if (insertError && isMissingEntrySourceColumnError(insertError)) {
        const fallbackRow =
          entrySource === "scan"
            ? { ...baseRow, source_image_url: RECIPE_AI_ENTRY_FALLBACK_MARKER }
            : baseRow;
        ({ data: row, error: insertError } = await supabase
          .from("recipes")
          .insert(fallbackRow)
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

  // Stan 2: parsing
  if (parsing) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-base font-semibold">Claude czyta przepis…</p>
        <p className="mt-1 text-sm text-muted-foreground">
          To zajmie 5-10 sekund (dwa przejścia: odczyt i strukturyzacja).
        </p>
      </div>
    );
  }

  // Stan 3a: form + panel referencyjny (po skanie)
  if (parseResult) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        {submitError && (
          <div
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {submitError}
          </div>
        )}
        <div className="flex flex-col-reverse gap-6 lg:grid lg:grid-cols-[1fr_340px]">
          <RecipeForm
            defaultValues={parseResult.recipe}
            fromScan
            onSubmit={(d) => handleSave(d, "scan")}
            onCancel={() => setParseResult(null)}
            isSubmitting={isSubmitting}
          />
          <ReferencePanel
            transcript={parseResult.transcript}
            imageDataUrl={parseResult.imageDataUrl}
          />
        </div>
      </div>
    );
  }

  // Stan 3b: pusty form (manual)
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

  // Stan 1: ekran wyboru
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

// ============================================================
// Reference panel — zdjęcie oryginalne + transkrypcja AI
// ============================================================

function ReferencePanel({
  transcript,
  imageDataUrl,
}: {
  transcript: string;
  imageDataUrl: string;
}) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center gap-2 border-b px-4 py-2.5">
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Zeskanowane zdjęcie
          </p>
        </div>
        <div className="bg-muted/30 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageDataUrl}
            alt="Zeskanowane zdjęcie przepisu"
            className="mx-auto block max-h-72 w-auto rounded border bg-white object-contain"
          />
        </div>
      </div>

      <details className="overflow-hidden rounded-lg border bg-card" open>
        <summary className="flex cursor-pointer items-center gap-2 border-b px-4 py-2.5 transition-colors hover:bg-muted/50">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="flex-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Odczyt AI ze zdjęcia
          </p>
          <span className="text-[10px] text-muted-foreground">
            klik aby zwinąć
          </span>
        </summary>
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-foreground/80">
          {transcript}
        </pre>
        <div className="border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
          To co Claude odczytał ze zdjęcia, zanim strukturyzował. Jeśli tu jest
          OK ale formularz po lewej ma błędy — łatwiej znaleźć co poprawić.
        </div>
      </details>
    </aside>
  );
}

// ============================================================
// Helpers
// ============================================================

async function sendToParseEndpoint(
  file: File
): Promise<{ transcript: string; recipe: Recipe }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/parse-recipe", {
    method: "POST",
    body: formData,
  });

  const body = (await res.json().catch(() => ({}))) as {
    transcript?: string;
    recipe?: Recipe;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(body.error || "Nie udało się odczytać przepisu");
  }

  if (!body.transcript || !body.recipe) {
    throw new Error("Niepoprawna odpowiedź z API");
  }

  return { transcript: body.transcript, recipe: body.recipe };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Nie udało się odczytać pliku"));
    reader.readAsDataURL(file);
  });
}
