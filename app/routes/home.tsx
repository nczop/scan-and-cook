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
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Welcome to Scan & Cook!
        </h2>
        <p className="text-gray-600">
          Digitize your favorite recipes and access them anytime, anywhere.
        </p>
      </section>

      {/* Latest recipe section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Latest Recipe
        </h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm">No recipes added yet</p>
        </div>
      </section>

      {/* Categories section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recipe Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}