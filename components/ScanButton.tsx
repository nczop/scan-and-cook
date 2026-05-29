"use client";

import {
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface ScanButtonProps
  extends Omit<ComponentProps<"button">, "type" | "onClick"> {
  /** Callback z wybranym/upuszczonym plikiem obrazu. */
  onFileSelected: (file: File) => void;
  /**
   * Zawartość przycisku (ikona, tekst, cała karta — cokolwiek).
   * Cały obszar `children` jest klikalny i akceptuje drop.
   */
  children: ReactNode;
  className?: string;
}

/**
 * Przycisk wywołujący wybór pliku obrazu.
 *
 * Cechy:
 * - Klik otwiera natywny picker (na mobile: aparat / biblioteka / pliki, na desktop: file dialog)
 * - Drag&drop działa na desktopie (na mobile pomijane przez przeglądarkę)
 * - Reset value po wyborze pozwala wybrać ten sam plik ponownie
 * - Stan drag-over przekazany przez data-attribute (do stylowania w Tailwindzie)
 *
 * Uwaga: NIE używamy `capture="environment"` żeby user mógł wybrać między
 * aparatem a galerią/plikami (na iOS sam picker ma trzy opcje).
 */
export function ScanButton({
  onFileSelected,
  children,
  className,
  disabled,
  ...buttonProps
}: ScanButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelected(file);
    }
  };

  return (
    <>
      <button
        type="button"
        {...buttonProps}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        disabled={disabled}
        data-drag-over={isDragOver}
        className={cn(
          "transition-all disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {children}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}
