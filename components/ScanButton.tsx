"use client";

import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScanButtonProps extends Omit<
  ComponentProps<"button">,
  "type" | "onClick"
> {
  onFileSelected: (file: File) => void;
  children: ReactNode;
  className?: string;
}

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
