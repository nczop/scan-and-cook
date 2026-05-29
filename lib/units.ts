import type { Ingredient, UnitKey } from "@/lib/schemas/recipe";

/**
 * Polski Intl.PluralRules zwraca:
 * - "one"   dla 1
 * - "few"   dla 2, 3, 4 (oraz np. 22, 23, 24)
 * - "many"  dla 0, 5+, 11-14 itd.
 * - "other" dla ułamków (0.5, 1.5)
 */
const pluralRules = new Intl.PluralRules("pl-PL");

/**
 * Słownik jednostek z formami gramatycznymi.
 * - Skróty wagi/objętości (g, kg, ml, l, dag) nie odmieniają się.
 * - Pełne słowa mają trzy formy: one / few / many.
 */
export const UNITS: Record<
  UnitKey,
  { one: string; few: string; many: string }
> = {
  g: { one: "g", few: "g", many: "g" },
  dag: { one: "dag", few: "dag", many: "dag" },
  kg: { one: "kg", few: "kg", many: "kg" },
  ml: { one: "ml", few: "ml", many: "ml" },
  l: { one: "l", few: "l", many: "l" },
  lyzka: { one: "łyżka", few: "łyżki", many: "łyżek" },
  lyzeczka: { one: "łyżeczka", few: "łyżeczki", many: "łyżeczek" },
  szklanka: { one: "szklanka", few: "szklanki", many: "szklanek" },
  szt: { one: "szt.", few: "szt.", many: "szt." },
  zabek: { one: "ząbek", few: "ząbki", many: "ząbków" },
  garsc: { one: "garść", few: "garście", many: "garści" },
  szczypta: { one: "szczypta", few: "szczypty", many: "szczypt" },
  listek: { one: "listek", few: "listki", many: "listków" },
  glowka: { one: "główka", few: "główki", many: "główek" },
};

/**
 * Opcje do dropdowna (pogrupowane).
 * `label` to forma mianownika liczby pojedynczej (to co user widzi w liście).
 */
export const UNIT_OPTIONS: {
  value: UnitKey;
  label: string;
  group: string;
}[] = [
  { value: "g", label: "g", group: "Waga" },
  { value: "dag", label: "dag", group: "Waga" },
  { value: "kg", label: "kg", group: "Waga" },
  { value: "ml", label: "ml", group: "Objętość" },
  { value: "l", label: "l", group: "Objętość" },
  { value: "lyzka", label: "łyżka", group: "Objętość kuchenna" },
  { value: "lyzeczka", label: "łyżeczka", group: "Objętość kuchenna" },
  { value: "szklanka", label: "szklanka", group: "Objętość kuchenna" },
  { value: "szczypta", label: "szczypta", group: "Objętość kuchenna" },
  { value: "szt", label: "szt.", group: "Sztuki" },
  { value: "zabek", label: "ząbek", group: "Sztuki" },
  { value: "garsc", label: "garść", group: "Sztuki" },
  { value: "listek", label: "listek", group: "Sztuki" },
  { value: "glowka", label: "główka", group: "Sztuki" },
];

/**
 * Zwraca odmienioną formę jednostki dla danej ilości.
 * Przykład: pluralizeUnit("lyzka", 2) -> "łyżki"
 */
export function pluralizeUnit(unit: UnitKey, amount: number): string {
  const form = pluralRules.select(amount);
  // "other" (ułamki) -> mapujemy na "many" - np. "pół łyżki" (dopełniacz)
  const key = form === "other" ? "many" : (form as "one" | "few" | "many");
  return UNITS[unit][key];
}

/**
 * Formatuje liczbę do wyświetlenia - ładne ułamki dla typowych wartości.
 */
function formatAmount(amount: number): string {
  if (amount === 0.5) return "½";
  if (amount === 0.25) return "¼";
  if (amount === 0.75) return "¾";
  if (amount === 0.33 || amount === 1 / 3) return "⅓";
  if (amount === 0.66 || amount === 2 / 3) return "⅔";
  if (Number.isInteger(amount)) return String(amount);
  return amount.toString();
}

/**
 * Formatuje cały składnik do jednego stringa.
 * Obsługuje wszystkie edge cases:
 * - brak ilości:        "sól, pieprz do smaku"
 * - brak jednostki:     "1 cebula"
 * - custom unit:        "1 pudełko makaronu"
 * - znana jednostka:    "2 łyżki śmietany"
 */
export function formatIngredient(ingredient: Ingredient): string {
  const { amount, unit, customUnit, name } = ingredient;

  if (amount === null) return name;

  const amountStr = formatAmount(amount);

  if (customUnit) return `${amountStr} ${customUnit} ${name}`;
  if (!unit) return `${amountStr} ${name}`;

  return `${amountStr} ${pluralizeUnit(unit, amount)} ${name}`;
}
