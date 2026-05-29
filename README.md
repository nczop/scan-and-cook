# scan-and-cook

Scan handwritten recipes and turn them into digital recipes with AI.

## Jednostki i pluralizacja

Moduł `lib/units.ts` formatuje składniki z polską odmianą jednostek (`Intl.PluralRules('pl-PL')`). Schemat składnika i klucze jednostek: `lib/schemas/recipe.ts`.

```ts
import { formatIngredient } from "@/lib/units";

formatIngredient({ amount: 2, unit: "lyzka", customUnit: null, name: "śmietany" });
// "2 łyżki śmietany"

formatIngredient({ amount: 5, unit: "lyzka", customUnit: null, name: "cukru" });
// "5 łyżek cukru"

formatIngredient({ amount: 0.5, unit: "lyzka", customUnit: null, name: "soli" });
// "½ łyżek soli"

formatIngredient({ amount: 1, unit: null, customUnit: null, name: "cebula" });
// "1 cebula"

formatIngredient({ amount: null, unit: null, customUnit: null, name: "sól do smaku" });
// "sól do smaku"

formatIngredient({ amount: 1, unit: null, customUnit: "pudełko", name: "makaronu" });
// "1 pudełko makaronu"
```

Eksporty: `UNITS`, `UNIT_OPTIONS`, `pluralizeUnit`, `formatIngredient`.
