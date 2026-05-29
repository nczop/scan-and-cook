import Link from "next/link";
import { BookOpen, Camera, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIngredient } from "@/lib/units";
import type { RecipeCardData } from "@/components/RecipeCard";

interface RecipeDetailProps {
  recipe: RecipeCardData & {
    createdAt: string | Date;
    updatedAt?: string | Date | null;
  };
  onDelete?: (id: string) => void;
}

export function RecipeDetail({ recipe, onDelete }: RecipeDetailProps) {
  return (
    <article className="rounded-xl border bg-card p-6 md:p-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-medium leading-tight">
            {recipe.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {recipe.isSeed && (
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-800 hover:bg-emerald-50"
              >
                <BookOpen className="mr-1 h-3 w-3" />
                Przykład
              </Badge>
            )}
            {recipe.source === "scan" && (
              <Badge
                variant="secondary"
                className="bg-violet-50 text-violet-800 hover:bg-violet-50"
              >
                <Camera className="mr-1 h-3 w-3" />
                Z aparatu
              </Badge>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/recipes/${recipe.id}/edit`}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edytuj
            </Link>
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Usuń przepis"
              onClick={() => onDelete(recipe.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </header>

      <section className="mb-6">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Składniki
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{formatIngredient(ing)}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sposób przygotowania
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step.value}</li>
          ))}
        </ol>
      </section>

      {recipe.notes && (
        <section className="rounded-lg bg-muted p-4">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Notatki
          </h2>
          <p className="text-sm italic leading-relaxed">„{recipe.notes}”</p>
        </section>
      )}

      <footer className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-4 text-xs text-muted-foreground">
        <span>Dodano {formatDate(recipe.createdAt)}</span>
        {recipe.updatedAt && (
          <>
            <span>·</span>
            <span>Edytowane {formatDate(recipe.updatedAt)}</span>
          </>
        )}
      </footer>
    </article>
  );
}

function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
