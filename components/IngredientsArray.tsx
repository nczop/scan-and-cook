"use client";

import { Plus, X } from "lucide-react";
import {
  Controller,
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Recipe } from "@/lib/schemas/recipe";
import { UNIT_OPTIONS } from "@/lib/units";

interface IngredientsArrayProps {
  control: Control<Recipe>;
  register: UseFormRegister<Recipe>;
  errors: FieldErrors<Recipe>;
}

export function IngredientsArray({
  control,
  register,
  errors,
}: IngredientsArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="text-sm font-medium">Składniki</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              amount: null,
              unit: null,
              customUnit: null,
              name: "",
            })
          }
        >
          <Plus className="mr-1 h-3 w-3" />
          Dodaj
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id}>
            {/* Desktop: jeden wiersz z trzema polami */}
            <div className="hidden grid-cols-[80px_140px_1fr_36px] gap-2 sm:grid">
              <Input
                type="number"
                step="0.25"
                placeholder="ilość"
                {...register(`ingredients.${index}.amount`, {
                  setValueAs: (v) =>
                    v === "" || v === null ? null : Number(v),
                })}
              />
              <UnitSelect control={control} index={index} />
              <Input
                placeholder="np. mąki"
                {...register(`ingredients.${index}.name`)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Usuń składnik"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Mobile: mini-karta z trzema wierszami */}
            <div className="rounded-lg bg-muted p-3 sm:hidden">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Składnik {index + 1}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="Usuń składnik"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="mb-2 grid grid-cols-[80px_1fr] gap-2">
                <Input
                  type="number"
                  step="0.25"
                  placeholder="ilość"
                  {...register(`ingredients.${index}.amount`, {
                    setValueAs: (v) =>
                      v === "" || v === null ? null : Number(v),
                  })}
                />
                <UnitSelect control={control} index={index} />
              </div>
              <Input
                placeholder="np. mąki"
                {...register(`ingredients.${index}.name`)}
              />
            </div>

            {errors.ingredients?.[index]?.name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.ingredients[index]?.name?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {errors.ingredients?.message && (
        <p className="mt-2 text-xs text-destructive">
          {errors.ingredients.message}
        </p>
      )}
    </div>
  );
}

/**
 * Dropdown wyboru jednostki - pogrupowany według kategorii (Waga / Objętość / Sztuki).
 * Wartość "" oznacza brak jednostki (np. "1 cebula").
 * Wartość "custom" mogłaby otwierać input customUnit - to do v2.
 */
function UnitSelect({
  control,
  index,
}: {
  control: Control<Recipe>;
  index: number;
}) {
  const grouped = groupByCategory(UNIT_OPTIONS);

  return (
    <Controller
      control={control}
      name={`ingredients.${index}.unit`}
      render={({ field }) => (
        <Select
          value={field.value ?? "__none__"}
          onValueChange={(v) => field.onChange(v === "__none__" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="jednostka" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">brak</SelectItem>
            {grouped.map(([group, options]) => (
              <SelectGroup key={group}>
                <SelectLabel>{group}</SelectLabel>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

function groupByCategory(options: typeof UNIT_OPTIONS) {
  const groups: Record<string, typeof UNIT_OPTIONS> = {};
  for (const opt of options) {
    if (!groups[opt.group]) groups[opt.group] = [];
    groups[opt.group].push(opt);
  }
  return Object.entries(groups);
}
