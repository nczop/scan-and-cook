import { Link } from 'react-router';
import { CameraIcon, PhotoIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function RecipeUploadOptions() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Add New Recipe
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/add-recipe/scan-photo"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-colors group"
          >
            <CameraIcon className="w-8 h-8 text-gray-400 group-hover:text-amber-500 mb-3" />
            <span className="text-sm font-medium text-gray-900">
              Scan with Camera
            </span>
            <span className="text-xs text-gray-500 text-center mt-1">
              Use your device's camera to scan a recipe
            </span>
          </Link>

          <Link
            to="/add-recipe/upload-photo"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-colors group"
          >
            <PhotoIcon className="w-8 h-8 text-gray-400 group-hover:text-amber-500 mb-3" />
            <span className="text-sm font-medium text-gray-900">
              Upload Photo
            </span>
            <span className="text-xs text-gray-500 text-center mt-1">
              Upload a photo of your recipe
            </span>
          </Link>

          <Link
            to="/add-recipe/add-recipe-form"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-colors group"
          >
            <PencilIcon className="w-8 h-8 text-gray-400 group-hover:text-amber-500 mb-3" />
            <span className="text-sm font-medium text-gray-900">
              Manual Entry
            </span>
            <span className="text-xs text-gray-500 text-center mt-1">
              Type your recipe manually
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
