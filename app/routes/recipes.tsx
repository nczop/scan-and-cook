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

  console.log('recipes', recipes);

  return (
    <div>
      <h1>Lista twoich przepisów</h1>
      <ul>
        {recipes.map(recipe => (
          <div>
            <Link to={`/recipes/${recipe.title}`} key={recipe.id}>
              {recipe.title}
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
}
