import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import NewRecipePageClient from "./NewRecipePageClient";

function NewRecipeFallback() {
  return (
    <div className="mx-auto flex max-w-3xl justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function NewRecipePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<NewRecipeFallback />}>
        <NewRecipePageClient />
      </Suspense>
    </div>
  );
}
