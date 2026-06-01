import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  FileDown,
  Rocket,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { ScanAndCookLogo } from "@/components/ScanAndCookLogo";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F1EFE8]">
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl outline-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring md:size-18"
              aria-label="Strona główna"
            >
              <ScanAndCookLogo className="size-14 md:size-18" />
            </Link>
            <span className="font-semibold text-primary">Scan & Cook</span>
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

        <section
          className="mb-16 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 p-6 shadow-sm md:p-8"
          aria-labelledby="roadmap-heading"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
              <Rocket className="h-3.5 w-3.5" aria-hidden />W rozwoju
            </span>
            <p className="text-sm text-muted-foreground">
              Aplikacja rośnie razem z Tobą — to dopiero początek.
            </p>
          </div>
          <h2
            id="roadmap-heading"
            className="mb-3 text-xl font-semibold text-primary md:text-2xl"
          >
            Co planujemy dalej?
          </h2>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Na razie możesz korzystać bez konta. W przyszłości pojawi się{" "}
            <strong className="font-medium text-foreground">rejestracja</strong>
            — wtedy zalogujesz się i odblokujesz kolejne możliwości, m.in.{" "}
            <strong className="font-medium text-foreground">
              eksport przepisów do PDF
            </strong>{" "}
            i sporo innych rzeczy. Śledź zmiany — będzie tylko lepiej.
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            <RoadmapItem
              icon={<UserPlus className="h-5 w-5" />}
              title="Konto i logowanie"
              text="Bezpieczna rejestracja, żeby Twoja kolekcja była zawsze przy Tobie."
            />
            <RoadmapItem
              icon={<FileDown className="h-5 w-5" />}
              title="PDF z przepisów"
              text="Jednym kliknięciem — do druku, na prezent albo do segregatora."
            />
            <RoadmapItem
              icon={<Sparkles className="h-5 w-5" />}
              title="I wiele więcej"
              text="Nowe funkcje będą się pojawiać — masz pomysł? Daj znać."
            />
          </ul>
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

interface RoadmapItemProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

function RoadmapItem({ icon, title, text }: RoadmapItemProps) {
  return (
    <li className="flex gap-3 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-amber-100/80 backdrop-blur-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
        {icon}
      </div>
      <div className="min-w-0 text-left">
        <h3 className="mb-0.5 text-sm font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {text}
        </p>
      </div>
    </li>
  );
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
