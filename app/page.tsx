import Link from "next/link";
import { ArrowRight, Camera, Check, Sparkles } from "lucide-react";
import { ScanAndCookLogo } from "@/components/ScanAndCookLogo";
import { Button } from "@/components/ui/button";

/**
 * Landing page (/).
 *
 * Cele:
 * 1. Dać rekruterowi kontekst zanim wejdzie w produkt
 * 2. Pokazać tech stack i atrybucję
 * 3. Trzymać próg wejścia na minimum (CTA "Wypróbuj teraz" -> /recipes)
 *
 * Anonymous sign-in i seedy nie wykonują się tu - dopiero w middleware
 * przy wejściu na /recipes. Dzięki temu odwiedziny landingu nie tworzą
 * w bazie wierszy ghost-userów.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F1EFE8]">
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              <ScanAndCookLogo className="size-14" />
            </div>
            <span className="font-semibold text-primary">Scan and Cook</span>
          </div>
        </nav>

        <section className="mb-20 text-center">
          <h1 className="mx-auto mb-4 max-w-xl text-4xl font-semibold leading-tight text-primary md:text-5xl">
            Cyfrowy zeszyt przepisów mamy
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            Sfotografuj kartkę z zeszytu, Claude ją odczyta i wypełni formularz.
            Sprawdzasz, zapisujesz, masz wszystkie przepisy w jednym miejscu.
          </p>
          <Button asChild size="lg">
            <Link href="/recipes">
              Wypróbuj teraz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Bez rejestracji — możesz spróbować od razu
          </p>
        </section>

        <section className="mb-16">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Jak to działa
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Step
              number="01"
              icon={<Camera className="h-5 w-5" />}
              title="Zrób zdjęcie"
              description="Fotografujesz stronę zeszytu albo wgrywasz plik."
            />
            <Step
              number="02"
              icon={<Sparkles className="h-5 w-5" />}
              title="Claude odczyta"
              description="AI rozpoznaje tytuł, składniki i kroki przygotowania."
            />
            <Step
              number="03"
              icon={<Check className="h-5 w-5" />}
              title="Sprawdź i zapisz"
              description="Edytujesz co trzeba i przepis trafia do Twojej kolekcji."
            />
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-foreground/10 pt-6 text-sm text-muted-foreground sm:flex-row">
          <span>
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/natalia-czop/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Natalia Czop
            </a>
          </span>
          <div className="flex gap-2 text-xs">
            <Badge>Next.js</Badge>
            <Badge>Supabase</Badge>
            <Badge>Claude</Badge>
          </div>
        </footer>
      </div>
    </main>
  );
}

interface StepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Step({ number, icon, title, description }: StepProps) {
  return (
    <div className="rounded-xl bg-white p-6 text-center">
      <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground">
        {number}
      </p>
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
        {icon}
      </div>
      <h3 className="mb-1.5 font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-white px-2 py-1 text-xs">{children}</span>
  );
}

// import Link from "next/link";
// import { createClient } from "@/lib/supabase/server";

// export default async function Home() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const { data: profile } = user
//     ? await supabase.from("profiles").select("is_anonymous, email").eq("id", user.id).single()
//     : { data: null };

//   return (
//     <div className="flex flex-1 flex-col items-center justify-center bg-background font-sans">
//       <main className="flex max-w-3xl flex-1 flex-col items-center justify-between bg-card px-16 py-32 sm:items-start">
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl leading-10 tracking-tight text-black dark:text-zinc-50">
//             Scan and Cook
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Cyfrowy przepiśnik — skanuj zdjęcia stron z przepisami i gotuj.
//           </p>
//           <Link
//             href="/recipes"
//             className="text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
//           >
//             Zobacz przykładową listę przepisów (mock)
//           </Link>
//           {user ? (
//             <p className="text-sm text-zinc-500 dark:text-zinc-500">
//               Sesja: {user.id.slice(0, 8)}…
//               {profile?.is_anonymous ? " (gość)" : " (konto)"}
//             </p>
//           ) : (
//             <p className="text-sm text-amber-600">Brak sesji — sprawdź middleware i Anonymous sign-ins w Supabase.</p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
