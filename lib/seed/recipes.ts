import type { Recipe } from "@/lib/schemas/recipe";

/**
 * Przykładowe przepisy do wstawienia po pierwszym anonymous sign-in
 * (`is_seed = true`). Ta sama treść co mock — docelowo jedno źródło prawdy.
 */
export type SeedRecipe = Recipe & { isSeed: true };

export const SEED_RECIPES: SeedRecipe[] = [
  {
    title: "Zupa pomidorowa mamy",
    isSeed: true,
    ingredients: [
      { amount: 800, unit: "g", customUnit: null, name: "pomidorów" },
      { amount: 1, unit: null, customUnit: null, name: "cebula" },
      { amount: 2, unit: "lyzka", customUnit: null, name: "śmietany 18%" },
      {
        amount: null,
        unit: null,
        customUnit: null,
        name: "sól, pieprz do smaku",
      },
    ],
    steps: [
      { value: "Obierz pomidory ze skórki i pokrój w kostkę." },
      { value: "Pokrój cebulę i podsmaż na maśle do zeszklenia." },
      { value: "Dodaj pomidory i duś przez 15 minut." },
      { value: "Zmiksuj, dodaj śmietanę, dopraw do smaku." },
    ],
    notes: "Mama dodawała szczyptę cukru żeby zbalansować pomidory.",
  },
  {
    title: "Sernik krakowski",
    isSeed: true,
    ingredients: [
      { amount: 1, unit: "kg", customUnit: null, name: "twarogu" },
      { amount: 6, unit: null, customUnit: null, name: "jaj" },
      { amount: 1, unit: "szklanka", customUnit: null, name: "cukru" },
    ],
    steps: [
      { value: "Zmiel twaróg trzykrotnie." },
      { value: "Ucieraj żółtka z cukrem na puszystą masę." },
    ],
    notes: null,
  },
  {
    title: "Pierogi ruskie",
    isSeed: true,
    ingredients: [
      { amount: 1, unit: "kg", customUnit: null, name: "mąki" },
      { amount: 1, unit: "szklanka", customUnit: null, name: "wody" },
      { amount: 1, unit: "szklanka", customUnit: null, name: "jaj" },
      { amount: 1, unit: "szklanka", customUnit: null, name: "masła" },
      { amount: 1, unit: "szklanka", customUnit: null, name: "cukru" },
      { amount: 1, unit: "szklanka", customUnit: null, name: "soli" },
    ],
    steps: [
      { value: "Zmiksuj mąkę, wodę, jajka, masło i cukier." },
      { value: "Podziel na 4 części i przygotuj 4 kulki." },
      { value: "Przykryj folią i odpocznij 30 minut." },
      { value: "Podziel kulkę na 8 części i zwinąć w kulki." },
      { value: "Zrób dziurkę w środku i włóż do gotującej się wody." },
    ],
    notes: null,
  },
];
