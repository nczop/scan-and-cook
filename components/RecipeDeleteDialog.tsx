"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "radix-ui";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface RecipeDeleteDialogProps {
  recipeId: string;
  recipeTitle: string;
  /** Klasy na przycisku triggera (np. `h-8 w-8` na karcie listy). */
  triggerClassName?: string;
  /**
   * `go-to-list` — po sukcesie przejście na /recipes (np. widok szczegółów).
   * `refresh` — tylko router.refresh() (np. już jesteś na liście).
   */
  afterDelete?: "go-to-list" | "refresh";
}

/**
 * Ikona kosza + AlertDialog z potwierdzeniem usunięcia przepisu z Supabase.
 */
export function RecipeDeleteDialog({
  recipeId,
  recipeTitle,
  triggerClassName,
  afterDelete = "go-to-list",
}: RecipeDeleteDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setOpen(false);
      if (afterDelete === "refresh") {
        router.refresh();
      } else {
        router.push("/recipes");
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(triggerClassName)}
          aria-label="Usuń przepis"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in"
          )}
        />
        <AlertDialog.Content
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in"
          )}
        >
          <div className="flex flex-col gap-2">
            <AlertDialog.Title className="text-lg">
              Usunąć ten przepis?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-muted-foreground">
              Czy na pewno chcesz usunąć przepis „{recipeTitle}”? Tej operacji
              nie da się cofnąć.
            </AlertDialog.Description>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
              >
                Anuluj
              </Button>
            </AlertDialog.Cancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Usuwanie…" : "Usuń przepis"}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
