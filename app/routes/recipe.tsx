import { useLoaderData } from 'react-router';
import { getAllRecipeNames, getRecipeByTitle } from '~/lib/db';
import type { Route } from '../../.react-router/types/app/+types/root';

export async function loader({ params }: Route.LoaderArgs) {
  const { title } = params;
  if (!title) {
    throw new Error('Title is required');
  }
  try {
    const recipe = await getRecipeByTitle(title);
    return { recipe };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default function RecipePage() {
  const { recipe } = useLoaderData<{ recipe: any }>();
  const recipeData = recipe[0];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {recipeData.title}
        </h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipeData.ingredients.map((ingredient: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center bg-gray-50 rounded-lg p-3"
                >
                  <span className="text-gray-900">
                    {ingredient.amount} {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}