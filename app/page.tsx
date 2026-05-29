import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("is_anonymous, email").eq("id", user.id).single()
    : { data: null };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background font-sans">
      <main className="flex max-w-3xl flex-1 flex-col items-center justify-between bg-card px-16 py-32 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Scan and Cook
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Cyfrowy przepiśnik — skanuj zdjęcia stron z przepisami i gotuj.
          </p>
          <Link
            href="/recipes"
            className="text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
          >
            Zobacz przykładową listę przepisów (mock)
          </Link>
          {user ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Sesja: {user.id.slice(0, 8)}…
              {profile?.is_anonymous ? " (gość)" : " (konto)"}
            </p>
          ) : (
            <p className="text-sm text-amber-600">Brak sesji — sprawdź middleware i Anonymous sign-ins w Supabase.</p>
          )}
        </div>
      </main>
    </div>
  );
}
