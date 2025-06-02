import { Link, useLoaderData } from 'react-router';
import { getAllRecipeNames, getRecipes } from '~/lib/db';

export async function loader() {
  try {
    const recipes = await getAllRecipeNames();
    return { recipes };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default function RecipesPage() {
  const { recipes } = useLoaderData<{ recipes: any[] }>();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Your Recipes</h1>
      
      <div className="bg-white rounded-2xl shadow-sm">
        {recipes.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recipes.map(recipe => (
              <Link
                to={`/recipes/${recipe.title}`}
                key={recipe.title}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {recipe.title}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No recipes added yet
          </div>
        )}
      </div>
    </div>
  );
}