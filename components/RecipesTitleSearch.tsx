"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 350;

type RecipesTitleSearchProps = {
  initialQuery: string;
};

export function RecipesTitleSearch({ initialQuery }: RecipesTitleSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const skipUrlToInputSync = useRef(false);

  const urlQ = searchParams.get("q") ?? "";

  useEffect(() => {
    if (skipUrlToInputSync.current) {
      skipUrlToInputSync.current = false;
      return;
    }
    setValue(urlQ);
  }, [urlQ]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const trimmed = value.trim();
      const current = (searchParams.get("q") ?? "").trim();
      if (trimmed === current) return;

      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      skipUrlToInputSync.current = true;
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(id);
  }, [value, pathname, router, searchParams]);

  return (
    <div
      className="mb-6 max-w-md"
      role="search"
      aria-label="Szukaj przepisów po tytule"
    >
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Szukaj przepisów po tytule…"
          className="h-9 border-foreground/22 bg-card pl-8 shadow-sm dark:border-white/28 dark:shadow-black/20"
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>
    </div>
  );
}
