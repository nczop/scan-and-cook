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

  console.log('recipe', recipe);

  return (
    <div>
      <h1>{recipe[0].title}</h1>
      <ul>
        {recipe[0].ingredients.map((ingredient: any, index: number) => (
          <li key={index}>
            {ingredient.amount} {ingredient.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
