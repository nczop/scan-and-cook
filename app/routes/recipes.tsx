import { Link, useLoaderData, Form } from 'react-router';
import { getAllRecipeNames, deleteRecipe } from '~/lib/db';
import { TrashIcon } from '@heroicons/react/24/outline';

export async function loader() {
  try {
    const recipes = await getAllRecipeNames();
    return { recipes };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const title = formData.get('title') as string;

  try {
    await deleteRecipe(title);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
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
              <div
                key={recipe.title}
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <Link to={`/recipes/${recipe.title}`} className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {recipe.title}
                  </h3>
                </Link>
                <Form method="post" className="ml-4">
                  <input type="hidden" name="title" value={recipe.title} />
                  <button
                    type="submit"
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete recipe"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </Form>
              </div>
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
