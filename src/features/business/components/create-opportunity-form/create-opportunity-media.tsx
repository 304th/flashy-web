import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";

export const CreateOpportunityMedia = () => {
  const form = useFormContext();
  const thumbnail = form.watch("thumbnail");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const handleGalleryUpload = (file: File) => {
    const newGallery = [...galleryFiles, file];
    setGalleryFiles(newGallery);
    form.setValue("galleryFiles", newGallery, { shouldDirty: true });
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = galleryFiles.filter((_, i) => i !== index);
    setGalleryFiles(newGallery);
    form.setValue("galleryFiles", newGallery, { shouldDirty: true });
  };

  const handleThumbnailChange = (file: File | null) => {
    setThumbnailFile(file);
    form.setValue("thumbnailFile", file, { shouldDirty: true });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <FormLabel>
          Thumbnail <span className="text-red-500">*</span>
        </FormLabel>
        <ImageUpload
          title="Upload Thumbnail"
          initialPreview={thumbnail}
          className="w-full"
          onChange={async (file) => {
            if (file) {
              form.setValue("thumbnailFile", file, { shouldDirty: true });
            } else {
              form.setValue("thumbnail", null, { shouldDirty: true });
            }
          }}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-base-700">16:9 Aspect Ratio</span>
          <span className="text-xs text-green-500">Upload</span>
        </div>
      </div>

      <div>
        <FormLabel>
          Media Assets <span className="text-red-500">*</span>
        </FormLabel>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2">
            {galleryFiles.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden
                  bg-base-400"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full
                    hover:bg-red-600"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
          <ImageUpload
            onChange={(file) => {
              if (file) handleGalleryUpload(file);
            }}
            className="aspect-square rounded-lg h-24"
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-base-700">1:1 Aspect Ratio</span>
          <span className="text-xs text-green-500">Upload</span>
        </div>
      </div>
    </div>
  );
};
