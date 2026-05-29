"use client";

import Link from "next/link";
import { ArrowLeft, Camera, ChevronRight, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScanButton } from "@/components/ScanButton";
import { cn } from "@/lib/utils";

interface NewRecipeChoiceProps {
  /** Callback gdy user wybierze plik do skanowania. */
  onScanFile: (file: File) => void;
  /** Link do formularza ręcznego (domyślnie `?mode=manual`; obsługiwane jest też `?manual=true` na stronie). */
  manualHref?: string;
  /** Link wstecz (domyślnie lista przepisów). */
  backHref?: string;
  /**
   * Niebieska karta skanu vs obie neutralne.
   * Ustaw `false`, żeby oba kafelki wyglądały tak samo (np. równouprawnienie opcji).
   */
  featured?: boolean;
}

/**
 * Ekran wyboru sposobu dodawania przepisu — pierwszy widok po „+”.
 *
 * Desktop: dwie kolumny; mobile: jedna kolumna (stack).
 * U góry: przycisk Wstecz + breadcrumb (Moje przepisy → Nowy).
 */
export function NewRecipeChoice({
  onScanFile,
  manualHref = "/recipes/new?mode=manual",
  backHref = "/recipes",
  featured = true,
}: NewRecipeChoiceProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" size="sm" className="w-fit shrink-0">
          <Link href={backHref}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Wstecz
          </Link>
        </Button>
        <nav
          aria-label="Ścieżka nawigacji"
          className="text-sm text-muted-foreground sm:text-right"
        >
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link
                href="/recipes"
                className="hover:text-foreground hover:underline"
              >
                Moje przepisy
              </Link>
            </li>
            <li className="flex items-center gap-1" aria-hidden>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </li>
            <li className="font-medium text-foreground" aria-current="page">
              Nowy
            </li>
          </ol>
        </nav>
      </div>

      <div>
        <h1 className="mb-1 text-xl">Dodaj nowy przepis</h1>
        <p className="text-sm text-muted-foreground">
          Wybierz, jak chcesz go dodać.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScanButton
          aria-label="Zeskanuj zdjęcie przepisu — wybierz plik lub zrób zdjęcie"
          onFileSelected={onScanFile}
          className={cn(
            "group flex h-full flex-col items-center rounded-xl p-6 text-center transition-all hover:-translate-y-0.5",
            featured
              ? "border-2 border-blue-200 bg-blue-50/40 hover:border-blue-300 hover:bg-blue-50/60 data-[drag-over=true]:border-blue-500 data-[drag-over=true]:bg-blue-100"
              : "border bg-card hover:border-foreground/20 hover:shadow-sm data-[drag-over=true]:border-foreground/30 data-[drag-over=true]:bg-muted/60"
          )}
        >
          <div
            className={cn(
              "mb-3 flex h-12 w-12 items-center justify-center rounded-full",
              featured
                ? "bg-blue-100 text-blue-700"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Camera className="h-5 w-5" />
          </div>
          <h3 className="mb-1.5 text-base">Zeskanuj zdjęcie</h3>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
            Sfotografuj zeszyt albo wgraj plik z dysku. Claude odczyta przepis i
            wypełni formularz za Ciebie.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
            <Sparkles className="h-3 w-3" />
            Powered by Claude
          </span>
        </ScanButton>

        <Link
          href={manualHref}
          className="group flex h-full flex-col items-center rounded-xl border bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Pencil className="h-5 w-5" />
          </div>
          <h3 className="mb-1.5 text-base">Wpisz ręcznie</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Wypełnij formularz krok po kroku — tytuł, składniki, sposób
            przygotowania, notatki.
          </p>
        </Link>
      </div>
    </div>
  );
}
