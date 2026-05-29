import { NextResponse, type NextRequest } from "next/server";
import { RecipeSchema } from "@/lib/schemas/recipe";

/**
 * POST multipart/form-data z polem `image` (plik obrazu).
 * Zwraca JSON zgodny z RecipeSchema.
 *
 * TODO (Etap 4): podłączyć Claude Vision + walidację odpowiedzi.
 * Na razie stub — żeby UI (/recipes/new) dało się przeklikać bez backendu AI.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || typeof file === "string" || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Brak pliku obrazu" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Dozwolone są tylko pliki graficzne" },
      { status: 400 }
    );
  }

  const stub = {
    title: "Zupa pomidorowa (demo ze stub API)",
    ingredients: [
      {
        amount: 400,
        unit: "g" as const,
        customUnit: null,
        name: "pomidorów z puszki",
      },
      { amount: 1, unit: "szt" as const, customUnit: null, name: "cebuli" },
      { amount: null, unit: null, customUnit: null, name: "sól, pieprz, bazylia" },
    ],
    steps: [
      { value: "Cebulę pokrój w kostkę i zeszklij na oleju." },
      { value: "Dodaj pomidory, dopraw i gotuj 15 minut." },
    ],
    notes:
      "To wypełnienie testowe z /api/parse-recipe — zamień endpoint na prawdziwy odczyt Claude.",
  };

  const parsed = RecipeSchema.safeParse(stub);
  if (!parsed.success) {
    return NextResponse.json({ error: "Błąd walidacji stubu" }, { status: 500 });
  }

  return NextResponse.json(parsed.data);
}
