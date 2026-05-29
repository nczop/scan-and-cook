import { z } from "zod";

/**
 * Klucze jednostek miary (canonical singular form).
 * Pełne tabele z odmianą polską znajdują się w lib/units.ts.
 */
export const UNIT_KEYS = [
  "g",
  "dag",
  "kg",
  "ml",
  "l",
  "lyzka",
  "lyzeczka",
  "szklanka",
  "szt",
  "zabek",
  "garsc",
  "szczypta",
  "listek",
  "glowka",
] as const;

export type UnitKey = (typeof UNIT_KEYS)[number];

/**
 * Pojedynczy składnik.
 * - `amount`: ilość (np. 2, 0.5, null gdy "sól do smaku")
 * - `unit`: canonical key z listy UNIT_KEYS (np. "lyzka")
 * - `customUnit`: gdy user wpisał własną jednostkę zamiast wybrać z listy
 * - `name`: nazwa składnika w formie gramatycznej jak ma się wyświetlać
 *   (np. "mąki", "śmietany" — tak jak w polskich przepisach)
 */
export const IngredientSchema = z.object({
  amount: z.number().nullable(),
  unit: z.enum(UNIT_KEYS).nullable(),
  customUnit: z.string().nullable(),
  name: z.string().min(1, "Nazwa składnika jest wymagana"),
});

/**
 * Krok przygotowania.
 * Wrapper `{ value: string }` upraszcza pracę z useFieldArray React Hook Form.
 */
export const StepSchema = z.object({
  value: z.string().min(1, "Krok nie może być pusty"),
});

/**
 * Pełny przepis. Ten schemat jest źródłem prawdy dla:
 * 1. Walidacji formularza (zodResolver w React Hook Form)
 * 2. Walidacji odpowiedzi z Claude API (RecipeSchema.safeParse)
 * 3. Typu Recipe w całej aplikacji
 */
export const RecipeSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  ingredients: z
    .array(IngredientSchema)
    .min(1, "Dodaj co najmniej jeden składnik"),
  steps: z.array(StepSchema).min(1, "Dodaj co najmniej jeden krok"),
  notes: z.string().nullable(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type Step = z.infer<typeof StepSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;

/**
 * Pusty przepis - przydatne jako defaultValues dla nowego formularza.
 */
export const EMPTY_RECIPE: Recipe = {
  title: "",
  ingredients: [{ amount: null, unit: null, customUnit: null, name: "" }],
  steps: [{ value: "" }],
  notes: null,
};
