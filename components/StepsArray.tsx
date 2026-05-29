"use client";

import { Plus, X } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Recipe } from "@/lib/schemas/recipe";

interface StepsArrayProps {
  control: Control<Recipe>;
  register: UseFormRegister<Recipe>;
  errors: FieldErrors<Recipe>;
}

export function StepsArray({ control, register, errors }: StepsArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="text-sm font-medium">Sposób przygotowania</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: "" })}
        >
          <Plus className="mr-1 h-3 w-3" />
          Dodaj
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex items-start gap-2">
              <div className="flex h-9 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
              </div>
              <Textarea
                rows={2}
                placeholder={`Krok ${index + 1}…`}
                className="flex-1 resize-none"
                {...register(`steps.${index}.value`)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Usuń krok"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            {errors.steps?.[index]?.value && (
              <p className="ml-9 mt-1 text-xs text-destructive">
                {errors.steps[index]?.value?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {errors.steps?.message && (
        <p className="mt-2 text-xs text-destructive">{errors.steps.message}</p>
      )}
    </div>
  );
}
