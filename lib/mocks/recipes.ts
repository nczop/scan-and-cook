import type { RecipeCardData } from "@/components/RecipeCard";

/** Mock przepisy — tymczasowo zamiast fetcha z bazy. */
export const MOCK_RECIPES: (RecipeCardData & {
  createdAt: string;
  updatedAt?: string | null;
})[] = [
  {
    id: "1",
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
    createdAt: "2024-01-10T12:00:00.000Z",
    updatedAt: null,
  },
  {
    id: "2",
    title: "Sernik krakowski",
    source: "scan",
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
    createdAt: "2024-02-01T09:00:00.000Z",
    updatedAt: "2024-02-05T14:30:00.000Z",
  },
];
