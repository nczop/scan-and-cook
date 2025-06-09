import { Form, redirect, useLoaderData } from 'react-router';
import { addRecipe, getCategories, type Recipe } from '~/lib/db';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

export async function loader() {
  try {
    const categories = await getCategories();
    return { categories };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const ingredientsRaw = formData.get('ingredients');
  let ingredients: { name: string; amount: string }[] = [];

  if (typeof ingredientsRaw === 'string') {
    try {
      ingredients = JSON.parse(ingredientsRaw);
    } catch (err) {
      console.error('Invalid ingredients JSON:', err);
    }
  }

  const data = Object.fromEntries(formData.entries());
  delete data.ingredients;

  const recipe = {
    ...data,
    ingredients,
  };

  try {
    await addRecipe(recipe as unknown as Recipe);
    return redirect('/recipes');
  } catch (error) {
    return {
      success: false,
      message: 'Coś poszło nie tak przy zapisie.',
    };
  }
}

export default function AddRecipeForm() {
  const { categories } = useLoaderData<{
    categories: { id: number; name: string }[];
  }>();

  const [ingredients, setIngredients] = useState([
    { id: crypto.randomUUID(), name: '', amount: '' },
  ]);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: crypto.randomUUID(), name: '', amount: '' },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const onChangeIngredient = (
    id: string,
    field: 'name' | 'amount',
    value: string,
  ) => {
    setIngredients(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">
          Add New Recipe
        </h1>
        <Form method="post" className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="e.g., Chocolate Chip Cookies"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category_id"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                defaultValue=""
                required
              >
                <option value="">select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <div className="space-y-4">
              {ingredients.map(ingredient => (
                <div key={ingredient.id} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={e =>
                        onChangeIngredient(
                          ingredient.id,
                          'name',
                          e.target.value,
                        )
                      }
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      placeholder="Ingredient name"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={e =>
                        onChangeIngredient(
                          ingredient.id,
                          'amount',
                          e.target.value,
                        )
                      }
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      placeholder="Amount (e.g., 200g)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient.id)}
                    className={`flex items-center justify-center h-full px-2 focus:outline-none ${ingredients.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Remove ingredient"
                    disabled={ingredients.length === 1}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Ingredient
              </button>
            </div>
          </div>
          <input
            type="hidden"
            name="ingredients"
            value={JSON.stringify(ingredients)}
          />
          <div>
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-gray-700"
            >
              Instructions
            </label>
            <textarea
              name="instructions"
              id="instructions"
              rows={8}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Enter the cooking instructions step by step"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 focus:outline-none"
            >
              Save Recipe
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
