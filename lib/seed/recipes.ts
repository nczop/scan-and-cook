import type { Recipe } from "@/lib/schemas/recipe";

/**
 * Przykładowe przepisy do wstawienia po pierwszym anonymous sign-in
 * (`is_seed = true`). Ta sama treść co mock — docelowo jedno źródło prawdy.
 */
export type SeedRecipe = Recipe & { isSeed: true };

export const SEED_RECIPES: SeedRecipe[] = [
  {
    title: "Brownie",
    isSeed: true,
    ingredients: [
      { amount: 200, unit: "g", customUnit: null, name: "masła" },
      { amount: 200, unit: "g", customUnit: null, name: "gorzkiej czekolady" },
      { amount: 3, unit: "szt", customUnit: null, name: "jaj" },
      { amount: 250, unit: "g", customUnit: null, name: "cukru" },
      { amount: 135, unit: "g", customUnit: null, name: "mąki" },
      { amount: 100, unit: "g", customUnit: null, name: "mlecznej czekolady" },
    ],
    steps: [
      {
        value:
          "Piekarnik nagrzać do 160 stopni C. Przygotować małą prostokątną foremkę o wymiarach ok. 21 cm x 28 cm (lub o podobnej powierzchni). Posmarować ją masłem i wyłożyć papierem do pieczenia.",
      },
      {
        value:
          "Masło pokroić w kostkę i włożyć do rondelka, dodać połamaną na kosteczki czekoladę i cały czas mieszając roztopić na małym ogniu, odstawić z palnika.",
      },
      {
        value:
          "W oddzielnej misce rozmiksować lub wymieszać rózgą jajka z cukrem. Dodać do nich roztopioną czekoladę z masłem zmiksować lub wymieszać rózgą na gładką masę.",
      },
      {
        value:
          "Dodać mąkę oraz sól i zmiksować na jednolite ciasto. Wyłożyć do przygotowanej blaszki, wyrównać powierzchnię.",
      },
      {
        value:
          "Czekoladę mlecznąpokroić zetrzeć na tarce i posypać po wierzchu ciasta.",
      },
      {
        value:
          "Wstawić do piekarnika i piec przez ok. 35 minut, aż ciasto lekko urośnie i na wierzchu utworzy się skorupka. Jeśli używamy większej blaszki, cias",
      },
      { value: "Po upieczeniu i ostudzeniu pokroić na małe kawałeczki." },
    ],
    notes: "Dodać szczyptę soli",
  },
  {
    title: "Tajskie curry z ciecierzycą, dynią i szpinakiem",
    isSeed: true,
    ingredients: [
      {
        amount: 1,
        unit: "szklanka",
        customUnit: null,
        name: "ugotowanej ciecierzycy (lub gotowej z puszki)",
      },
      {
        amount: 300,
        unit: "g",
        customUnit: null,
        name: "dyni (zważonej przed obraniem)",
      },
      { amount: 1, unit: "szt", customUnit: null, name: "małej cebuli" },
      {
        amount: 1,
        unit: "lyzeczka",
        customUnit: null,
        name: "czerwonej pasty curry (lub po 1 łyżeczce tartego czosnku i imbiru oraz 1/2 łyżeczki mielonej ostrej papryki)",
      },
      {
        amount: 0.5,
        unit: "lyzeczka",
        customUnit: null,
        name: "mielonej kurkumy",
      },
      {
        amount: 150,
        unit: "ml",
        customUnit: null,
        name: "mleczka kokosowego",
      },
      {
        amount: 0.5,
        unit: "szklanka",
        customUnit: null,
        name: "bulionu (ok.)",
      },
      {
        amount: null,
        unit: null,
        customUnit: null,
        name: "dużej garści szpinaku",
      },
    ],
    steps: [
      {
        value:
          "Ugotować ciecierzycę jak w tym przepisie lub przygotować ciecierzycę z puszki. Dynię obrać i pokroić w kostkę. Cebulę pokroić w piórka.",
      },
      {
        value:
          "Na patelni na 2 łyżkach mleka kokosowego podsmażyć pastę curry lub imbir, czosnek i ostrą paprykę. Dodać dynię, cebulę, doprawić solą i smażyć co chwilę mieszając przez około 2 minuty.",
      },
      {
        value:
          "Dodać mieloną kurkumę oraz ugotowaną ciecierzycę (jeśli mamy dajemy też kilka łyżek zalewy, w której gotowała się ciecierzyca). Dodać kolejne 2 łyżki mleka i smażyć przez 1 minutę.",
      },
      {
        value:
          "Wlać resztę mleka kokosowego i zagotować. Gotować przez ok. 15 minut co chwilę mieszając. Wlewać stopniowo bulion i gotować przez ok. 5 - 10 minut aż dynia będzie już miękka. W międzyczasie co chwilę zamieszać. Na koniec dodać szpinak, wymieszać i odstawić z ognia.",
      },
    ],
    notes:
      "Posypać kolendrą i świeżą chili, podawać z ryżem i cząstką limonki.",
  },
  {
    title: "Ciasto na pierogi",
    isSeed: true,
    ingredients: [
      { amount: 300, unit: "g", customUnit: null, name: "mąki pszennej" },
      { amount: 1, unit: "szczypta", customUnit: null, name: "soli" },
      { amount: 125, unit: "ml", customUnit: null, name: "wrzącej wody" },
      { amount: 1, unit: "szt", customUnit: null, name: "jajka" },
      {
        amount: 20,
        unit: "g",
        customUnit: null,
        name: "masła (lub oleju zamiast masła)",
      },
    ],
    steps: [
      {
        value:
          "Mąkę wsypać do miski, dodać sól. Do wrzącej wody włożyć masło i roztopić lub wlać olej. Stopniowo wlewać do mąki, mieszając wszystko łyżką. W międzyczasie dodać roztrzepane jajko i połączyć wszystkie składniki, zagnieść gładkie ciasto.",
      },
      {
        value:
          "Wyłożyć na podsypany mąką blat i wygniatać przez około 7 - 8 minut. Zawinąć w ściereczkę kuchenną i odstawić na ok. 30 minut.",
      },
      {
        value:
          "Ciasto podzielić na 4 części i kolejno rozwałkowywać na cienki placek (około 2 - 3 mm), obsypując w razie potrzeby stolnicę mąką.",
      },
      {
        value:
          "Małą szklanką wycinać kółka, rozciągnąć je trochę w palcach, następnie na środek nakładać po jednej czubatej łyżeczce farszu.",
      },
      {
        value:
          "Składać na pół i zlepiać dokładnie brzegi, układać na stolnicy.",
      },
      {
        value:
          "W dużym garnku zagotować osoloną wodę i jak będzie mocno wrzała, włożyć pierwszą partię pierogów (około 15 sztuk).",
      },
      {
        value:
          "Po ponownym zagotowaniu zmniejszyć ogień do średniego i gotować pierożki przez około 2 minuty licząc od czasu wypłynięcia ich na powierzchnię wody (do czasu aż ciasto będzie miękkie, sprawdzamy palcem wyławiając jednego pieroga).",
      },
      {
        value:
          "Długość gotowania zależy od grubości ciasta. Wyłowić łyżką cedzakową na talerz.",
      },
    ],
    notes: null,
  },
];
