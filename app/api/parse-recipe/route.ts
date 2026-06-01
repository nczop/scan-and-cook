import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { RecipeSchema, UNIT_KEYS } from "@/lib/schemas/recipe";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;
type SupportedMediaType = (typeof SUPPORTED_TYPES)[number];

const anthropic = new Anthropic();

// ============================================================
// PROMPT 1: TRANSKRYPCJA (vision-only, brak strukturyzacji)
// ============================================================

const TRANSCRIBE_PROMPT = `Jesteś asystentem do transkrypcji przepisów kulinarnych ze zdjęć — najczęściej z ręcznie pisanych zeszytów lub książek kucharskich.

Twoim ZADANIEM jest dokładnie przepisać CAŁY tekst widoczny na zdjęciu — linijka po linijce, w oryginalnej kolejności.

ZASADY:

- Przepisuj DOKŁADNIE to co widzisz. NIE interpretuj, NIE strukturyzuj, NIE upraszczaj.
- Zachowaj oryginalne podziały na linie i akapity.
- Zachowaj oryginalną pisownię — nawet jeśli wygląda na błąd ortograficzny.
- Zachowaj oryginalne skróty (np. "łyż.", "g.", "szkl.", "ząb.").
- Zachowaj numerację kroków jeśli jest (1., 2., 3. albo I., II., III.).
- Jeśli fragment jest nieczytelny — oznacz go [???] zamiast zgadywać.
- Jeśli na zdjęciu są dwa przepisy lub fragmenty — przepisz wszystko w kolejności.
- NIE dodawaj własnych nagłówków typu "Składniki:" jeśli nie ma ich w przepisie.
- NIE dodawaj wyjaśnień, komentarzy, markdown ani \`\`\`.

POŚWIĘĆ CZAS na dokładne odczytanie pisma odręcznego. Patrz na kontekst — jeśli widzisz "200" przy słowie wyglądającym jak "może" — to prawdopodobnie "mąka". Polskie przepisy są przewidywalne (składniki + kroki).

Zwracasz CZYSTY TEKST. Bez markdown, bez wyjaśnień przed ani po.`;

// ============================================================
// PROMPT 2: STRUKTURYZACJA (text-in, JSON-out)
// ============================================================

const STRUCTURE_PROMPT = `Jesteś asystentem strukturyzującym polskie przepisy kulinarne. Dostajesz tekst przepisu (odczytany wcześniej ze zdjęcia) i masz zwrócić obiekt JSON.

ZWRACASZ WYŁĄCZNIE JSON. Bez markdown, bez \`\`\`json, bez wyjaśnień przed ani po.

STRUKTURA:

{
  "title": string,
  "ingredients": [
    {
      "amount": number | null,
      "unit": string | null,
      "customUnit": string | null,
      "name": string
    }
  ],
  "steps": [
    { "value": string }
  ],
  "notes": string | null
}

POLE "unit":

Canonical key (mianownik liczby pojedynczej bez polskich znaków) z listy:
${UNIT_KEYS.map((u) => `"${u}"`).join(", ")}

Mapowanie odmienionych form na canonical keys:
- "łyżka" / "łyżki" / "łyżek" / "łyż." -> "lyzka"
- "łyżeczka" / "łyżeczki" / "łyżeczek" / "łyżecz." -> "lyzeczka"
- "szklanka" / "szklanki" / "szklanek" / "szkl." -> "szklanka"
- "ząbek" / "ząbki" / "ząbków" / "ząb." -> "zabek"
- "szczypta" / "szczypty" / "szczypt" -> "szczypta"
- "garść" / "garście" / "garści" -> "garsc"
- "listek" / "listki" / "listków" -> "listek"
- "główka" / "główki" / "główek" -> "glowka"
- "sztuka" / "sztuki" / "sztuk" / "szt." -> "szt"
- nieodmienne: "g", "dag", "kg", "ml", "l" -> bez zmian

POLE "customUnit":

Użyj WYŁĄCZNIE gdy w tekście jednostka NIE pasuje do listy canonical (np. "pudełko", "buteleczka", "torebka", "puszka", "opakowanie"). Wtedy "unit" musi być null.

POLE "amount":

- "pół" -> 0.5
- "ćwierć" -> 0.25
- "1/2" -> 0.5, "1/4" -> 0.25, "3/4" -> 0.75
- "1½" -> 1.5
- "kilka" / "trochę" / "do smaku" / bez podanej ilości -> null
- Liczby ZAWSZE jako number (nie string)

POLE "name":

Zostaw w formie z tekstu. Polskie przepisy używają DOPEŁNIACZA ("mąki", "śmietany", "cukru") — NIE zmieniaj na mianownik. "200 g mąki" -> name: "mąki", nie "mąka".

"steps":

Każdy krok przygotowania jako osobny obiekt { "value": "..." }. Jeśli tekst ma ponumerowane kroki (1., 2., 3.) — każdy osobno. Jeśli kroki są w jednym akapicie ale rozdzielone kropkami i nową linią — też każdy osobno. NIE łącz wielu kroków w jeden value.

"notes":

Tylko jeśli w tekście są DODATKOWE uwagi poza składnikami i krokami (np. "najlepiej smakuje na drugi dzień", "podawać z koperkiem", "babcia dodawała szczyptę cukru"). W przeciwnym razie null.

GDY TEKST NIE WYGLĄDA NA PRZEPIS:

Zwróć: { "title": "", "ingredients": [], "steps": [], "notes": null }
NIE wymyślaj treści — pusty obiekt jest lepszy niż halucynacja.`;

// ============================================================
// PASS 1: TRANSKRYPCJA
// ============================================================

async function transcribeImage(
  base64: string,
  mediaType: SupportedMediaType
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    system: TRANSCRIBE_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: "Przepisz cały tekst z tego zdjęcia.",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Brak tekstu w odpowiedzi z transkrypcji");
  }
  return textBlock.text.trim();
}

// ============================================================
// PASS 2: STRUKTURYZACJA
// ============================================================

async function structureRecipe(transcript: string): Promise<unknown> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    system: STRUCTURE_PROMPT,
    messages: [
      {
        role: "user",
        content: `Tekst przepisu odczytany ze zdjęcia:\n\n${transcript}\n\nZwróć JSON zgodny ze schematem.`,
      },
      {
        // Prefill "{" - tu jest OK bo Pass 2 to czyste text-to-JSON,
        // model nie potrzebuje thinking time na "patrzenie".
        role: "assistant",
        content: "{",
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Brak tekstu w odpowiedzi ze strukturyzacji");
  }
  return JSON.parse("{" + textBlock.text);
}

// ============================================================
// HANDLER
// ============================================================

export async function POST(request: NextRequest) {
  // 1. Walidacja inputu
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane formularza" },
      { status: 400 }
    );
  }

  const file = formData.get("image");
  if (!file || typeof file === "string" || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Brak pliku obrazu" }, { status: 400 });
  }

  if (!SUPPORTED_TYPES.includes(file.type as SupportedMediaType)) {
    return NextResponse.json(
      {
        error: "Nieobsługiwany format pliku. Wspieramy: JPEG, PNG, GIF, WebP.",
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: `Plik za duży (max ${MAX_IMAGE_SIZE / 1024 / 1024} MB).` },
      { status: 400 }
    );
  }

  // 2. Konwersja do base64
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mediaType = file.type as SupportedMediaType;

  // 3. Pass 1: transkrypcja
  let transcript: string;
  try {
    transcript = await transcribeImage(base64, mediaType);
  } catch (error) {
    console.error("[parse-recipe] Transcribe error:", error);
    return NextResponse.json(
      { error: "Nie udało się odczytać tekstu ze zdjęcia. Spróbuj ponownie." },
      { status: 502 }
    );
  }

  // Pusty/krótki transcript - prawdopodobnie nie ma przepisu
  if (!transcript || transcript.length < 10) {
    return NextResponse.json(
      {
        error:
          "Na zdjęciu nie wykryto tekstu przepisu. Spróbuj wyraźniejszego ujęcia.",
        transcript: transcript || "",
      },
      { status: 422 }
    );
  }

  // 4. Pass 2: strukturyzacja
  let json: unknown;
  try {
    json = await structureRecipe(transcript);
  } catch (error) {
    console.error("[parse-recipe] Structure error:", error, {
      transcriptPreview: transcript.slice(0, 200),
    });
    return NextResponse.json(
      {
        error:
          "Udało się odczytać tekst, ale nie udało się go ustrukturyzować. Spróbuj ponownie lub wypełnij ręcznie.",
        transcript,
      },
      { status: 502 }
    );
  }

  // 5. Walidacja Zodem
  const result = RecipeSchema.safeParse(json);
  if (!result.success) {
    console.error(
      "[parse-recipe] Zod validation error:",
      result.error.format()
    );
    return NextResponse.json(
      {
        error:
          "Odczyt nie pasuje do oczekiwanej struktury. Możesz porównać z transkrypcją obok.",
        transcript,
      },
      { status: 422 }
    );
  }

  // 6. Sukces - zwracamy transkrypcję + ustrukturyzowany recipe
  return NextResponse.json({
    transcript,
    recipe: result.data,
  });
}
