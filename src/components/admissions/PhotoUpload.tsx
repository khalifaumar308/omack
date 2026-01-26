import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadFile } from '@/lib/api/mutations';

export default function PhotoUpload() {
  const { setValue, formState: { errors } } = useFormContext();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { mutate: uploadFile, isPending } = useUploadFile();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image size must be less than 2MB'); return; }
    // const formData = new FormData();
    // formData.append('file', file);
    uploadFile(file, {
      onSuccess: (res) => {
        if (res.success && res.data?.url) {
          setValue('passportPhoto', res.data.url);
          setPhotoPreview(res.data.url);
        } else {
          toast.error('Failed to upload photo. Please try again.');
        }
      },
      onError: () => {
        toast.error('Failed to upload photo. Please try again.');
      },
    });
  };

  const removePhoto = () => {
    setValue('passportPhoto', '');
    setPhotoPreview(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Passport Photograph *</label>
      <div className="mt-2">
        {!photoPreview ? (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </label>
          </div>
        ) : (
          <div className="relative w-48 h-48 mx-auto border-2 border-gray-300 rounded-lg overflow-hidden">
            <img src={photoPreview} alt="Passport" className="w-full h-full object-cover" />
            <button type="button" onClick={removePhoto} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        )}
        {isPending && <p className="text-center text-indigo-600 text-sm mt-2">Uploading photo...</p>}
        {errors.passportPhoto?.message && <p className="text-red-600 text-sm mt-1">{String(errors.passportPhoto.message)}</p>}
      </div>
    </div>
  );
}
