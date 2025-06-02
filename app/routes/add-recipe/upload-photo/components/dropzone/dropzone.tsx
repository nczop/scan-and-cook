import { useRef, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { cn } from '~/utils/className-utils';

interface DropzoneProps {
  onImageSelect: (file: File) => void;
  className?: string;
}

export default function Dropzone({ onImageSelect, className }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageSelect(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  return (
    <div className={cn('flex items-center justify-center w-full', className)}>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
          isDragging
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-300 hover:border-amber-500 hover:bg-amber-50',
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG or GIF (Recommended: 1600x900px)
          </p>
        </div>
        <input
          ref={fileInputRef}
          id="dropzone-file"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
