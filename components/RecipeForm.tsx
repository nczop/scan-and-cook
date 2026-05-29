"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { IngredientsArray } from "@/components/IngredientsArray";
import { StepsArray } from "@/components/StepsArray";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_RECIPE, RecipeSchema, type Recipe } from "@/lib/schemas/recipe";

interface RecipeFormProps {
  /** Domyślne wartości - dla edycji albo wyniku skanu z AI. */
  defaultValues?: Partial<Recipe>;
  /** Callback wywoływany po udanej walidacji. */
  onSubmit: (data: Recipe) => void | Promise<void>;
  /** Pokazuje "Anuluj" - przy braku callbacka anulować nie można. */
  onCancel?: () => void;
  /** Pokazuje niebieski baner "Przejrzyj odczyt AI" - po skanie zdjęcia. */
  fromScan?: boolean;
  /** Stan loading podczas mutacji. */
  isSubmitting?: boolean;
  /** Tekst głównego przycisku - domyślnie "Zapisz przepis". */
  submitLabel?: string;
}

/**
 * Współdzielony formularz przepisu.
 *
 * Trzy konteksty użycia:
 * 1. /recipes/new - nowy przepis ręcznie (pusty, bez bannera)
 * 2. /recipes/new po skanowaniu - wynik AI (wypełniony, z bannerem fromScan)
 * 3. /recipes/[id]/edit - edycja istniejącego (wypełniony, bez bannera)
 */
export function RecipeForm({
  defaultValues,
  onSubmit,
  onCancel,
  fromScan,
  isSubmitting,
  submitLabel = "Zapisz przepis",
}: RecipeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Recipe>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: { ...EMPTY_RECIPE, ...defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border bg-card p-6 md:p-8"
    >
      {fromScan && (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 p-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
          <div>
            <p className="text-sm font-medium text-blue-950">
              Przejrzyj odczyt AI
            </p>
            <p className="text-xs leading-relaxed text-blue-800">
              Claude odczytał przepis ze zdjęcia. Sprawdź czy wszystko się
              zgadza, popraw co trzeba i kliknij Zapisz.
            </p>
          </div>
        </div>
      )}

      <div className="mb-5">
        <Label htmlFor="title" className="mb-1.5 block text-sm font-medium">
          Tytuł
        </Label>
        <Input
          id="title"
          placeholder="np. Zupa pomidorowa mamy"
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="mb-5">
        <IngredientsArray control={control} register={register} errors={errors} />
      </div>

      <div className="mb-5">
        <StepsArray control={control} register={register} errors={errors} />
      </div>

      <div className="mb-6">
        <Label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
          Notatki{" "}
          <span className="font-normal text-muted-foreground">
            (opcjonalnie)
          </span>
        </Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Uwagi mamy, sztuczki kulinarne, sentymentalne dopiski…"
          {...register("notes", {
            setValueAs: (v) => (v === "" || v === null ? null : v),
          })}
        />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          <Check className="mr-2 h-4 w-4" />
          {isSubmitting ? "Zapisywanie…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
