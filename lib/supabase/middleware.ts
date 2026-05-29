import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";
import { insertSeedRecipesIfEmpty } from "@/lib/seed/insertSeedRecipes";

function copyAuthCookies(from: NextResponse, to: NextResponse) {
  for (const c of from.cookies.getAll()) {
    to.cookies.set(c.name, c.value);
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInAnonymously();
    if (signInError || !signInData.user) {
      return supabaseResponse;
    }
    await insertSeedRecipesIfEmpty(supabase, signInData.user.id);
    if (!request.nextUrl.pathname.startsWith("/recipes")) {
      const redirectResponse = NextResponse.redirect(
        new URL("/recipes", request.url)
      );
      copyAuthCookies(supabaseResponse, redirectResponse);
      return redirectResponse;
    }
  }

  return supabaseResponse;
}
