import type { ImgHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Ścieżka do pliku marki (UI + `metadata.icons` w `app/layout.tsx`). */
export const SCAN_AND_COOK_LOGO_SRC = "/logo.svg" as const;

/**
 * Marka w układzie kwadratowym. Grafika w {@link SCAN_AND_COOK_LOGO_SRC}.
 * Rozmiar ustawiasz przez `className` (nadpisuje domyślne `size-8`) albo `style` / atrybuty `img`.
 */
export function ScanAndCookLogo({
  className,
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={SCAN_AND_COOK_LOGO_SRC}
      alt={alt}
      draggable={false}
      className={cn("size-8 shrink-0", className)}
      {...props}
    />
  );
}
