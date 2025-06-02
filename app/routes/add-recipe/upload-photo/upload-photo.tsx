import Dropzone from './components/dropzone/dropzone';

export default function UploadPhoto() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Dropzone className="w-[800px]" />
    </div>
  );
}
