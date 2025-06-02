import { useLoaderData, Link } from 'react-router';
import { getCategories } from '../lib/db';

export async function loader() {
  try {
    const categories = await getCategories();
    return { categories };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default function HomePage() {
  const { categories } = useLoaderData<{
    categories: { id: number; name: string }[];
  }>();

  return (
    <div className="max-w-[1024px] w-full mx-auto">
      {/* <h1>Witam Cię w Scan & Cook!</h1> */}
      <div>Ostatnio dodany przepis </div>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}
