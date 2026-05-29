import Link from "next/link";
import { BookOpen, Camera, List, ListChecks, Pencil } from "lucide-react";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { RecipeDeleteDialog } from "@/components/RecipeDeleteDialog";
import type { Recipe } from "@/lib/schemas/recipe";

export type RecipeCardData = Recipe & {
  id: string;
  isSeed?: boolean;
  source?: "manual" | "scan";
};

interface RecipeCardProps {
  recipe: RecipeCardData;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col p-5">
        <Link href={`/recipes/${recipe.id}`} className="group mb-2 block">
          <h3 className="text-base leading-tight group-hover:underline">
            {recipe.title}
          </h3>
        </Link>

        {recipe.isSeed && (
          <Badge
            variant="secondary"
            className="mb-3 self-start bg-emerald-50 text-emerald-800 hover:bg-emerald-50"
          >
            <BookOpen className="mr-1 h-3 w-3" />
            Przykład
          </Badge>
        )}

        {recipe.source === "scan" && (
          <Badge
            variant="secondary"
            className="mb-3 self-start bg-violet-50 text-violet-800 hover:bg-violet-50"
          >
            <Camera className="mr-1 h-3 w-3" />Z aparatu
          </Badge>
        )}

        {recipe.source === "manual" && (
          <Badge
            variant="secondary"
            className="mb-3 self-start bg-rose-50 text-rose-900 hover:bg-rose-50"
          >
            <Pencil className="mr-1 h-3 w-3" />
            Wpisany ręcznie
          </Badge>
        )}

        {recipe.notes && (
          <p className="mb-3 line-clamp-2 text-sm italic text-muted-foreground">
            „{recipe.notes}”
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <List className="h-3.5 w-3.5" />
              {recipe.ingredients.length}
            </span>
            <span className="flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" />
              {recipe.steps.length}
            </span>
          </div>
          <div className="flex gap-1">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                aria-label="Edytuj przepis"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <RecipeDeleteDialog
              recipeId={recipe.id}
              recipeTitle={recipe.title}
              afterDelete="refresh"
              triggerClassName="h-8 w-8"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
