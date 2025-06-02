import { Link } from 'react-router';

export default function RecipeUploadOptions() {
  return (
    <div className="max-w-[1024px] w-full mx-auto">
      <h2 className="text-xl font-semibold text-center">
        Jak chcesz dodać przepis?
      </h2>
      <div className="flex flex-row gap-4 justify-center">
        <Link
          to="/add-recipe/scan-photo"
          className="border border-pink-900 rounded-md p-2"
        >
          Skanuj telefonem
        </Link>
        <Link
          to="/add-recipe/upload-photo"
          className="border border-pink-900 rounded-md p-2"
        >
          Wgraj zdjęcie
        </Link>
        <Link
          to="/add-recipe/add-recipe-form"
          className="border border-pink-900 rounded-md p-2"
        >
          Wpisz przepis
        </Link>
      </div>
    </div>
  );
}
