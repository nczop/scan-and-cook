import { useState } from 'react';
import Dropzone from './components/dropzone/dropzone';

export default function UploadPhoto() {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Upload Recipe Photo
        </h1>

        <div className="space-y-6">
          <Dropzone
            onImageSelect={file => {
              const url = URL.createObjectURL(file);
              setPreview(url);
            }}
          />

          {preview && (
            <div className="mt-6 space-y-4">
              <div className="aspect-video w-full relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={preview}
                  alt="Recipe preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle image processing here
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Process Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}