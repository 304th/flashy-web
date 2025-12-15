import config from "@/config";
import { useState, type ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { X, UploadCloudIcon, FileText } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { FileUpload } from "@/components/ui/file-upload";
import { useDragAndDrop } from "@/hooks/use-drag-n-drop";

const MAX_GALLERY_FILES = 8;

const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".pdf", ".doc", ".docx"];

const isImageFile = (file: File) => file.type.startsWith("image/");

const getFileExtension = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? `.${ext}` : "";
};

export const CreateOpportunityMedia = () => {
  const form = useFormContext();
  const thumbnail = form.watch("thumbnail");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const handleGalleryFilesUpload = (files: File[]) => {
    if (files.length === 0) return;

    const currentGallery = galleryFiles;
    const remainingSlots = MAX_GALLERY_FILES - currentGallery.length;

    if (remainingSlots <= 0) {
      toast.error(`You can only upload up to ${MAX_GALLERY_FILES} files.`);
      return;
    }

    const validFiles: File[] = [];
    let hasError = false;

    for (const file of files) {
      const extension = getFileExtension(file.name);
      const isValidType = ALLOWED_FILE_TYPES.includes(file.type) ||
        ALLOWED_EXTENSIONS.includes(extension);

      if (!isValidType) {
        toast.error(
          `"${file.name}" is not a supported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
        );
        hasError = true;
        continue;
      }

      if (file.size > config.content.uploads.image.maxSize) {
        toast.error(
          `File "${file.name}" size must be less than ${config.content.uploads.image.maxSize / (1024 * 1024)} MB.`,
        );
        hasError = true;
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      const filesToAdd = validFiles.slice(0, remainingSlots);
      if (filesToAdd.length < validFiles.length) {
        toast.error(
          `Only ${filesToAdd.length} file(s) added. You can upload up to ${MAX_GALLERY_FILES} files total.`,
        );
      }
      const newGallery = [...currentGallery, ...filesToAdd];
      setGalleryFiles(newGallery);
      form.setValue("galleryFiles", newGallery, { shouldDirty: true });
      form.setValue("mediaAssetFiles", newGallery, { shouldDirty: true });
    } else if (!hasError) {
      toast.error("No valid files selected.");
    }
  };

  const handleGalleryFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleGalleryFilesUpload(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = galleryFiles.filter((_, i) => i !== index);
    setGalleryFiles(newGallery);
    form.setValue("galleryFiles", newGallery, { shouldDirty: true });
    form.setValue("mediaAssetFiles", newGallery, { shouldDirty: true });
  };

  const handleThumbnailChange = (file: File | null) => {
    setThumbnailFile(file);
    form.setValue("thumbnailFile", file, { shouldDirty: true });
  };

  const { isDragActive, dragHandlers } = useDragAndDrop(
    handleGalleryFilesUpload,
  );

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
      </div>

      <div className="flex flex-col gap-2">
        <FormLabel>
          Media Assets <span className="text-red-500">*</span>
        </FormLabel>
        <div
          className={`relative rounded-lg transition-all duration-150 ${
            isDragActive
              ? "p-2 border-2 border-blue-500 border-dashed bg-blue-500/10"
              : "p-0"
            }`}
          onDragEnter={dragHandlers.onDragEnter}
          onDragOver={dragHandlers.onDragOver}
          onDragLeave={dragHandlers.onDragLeave}
          onDrop={dragHandlers.onDrop}
        >
          {isDragActive && (
            <div
              className="absolute inset-0 flex items-center justify-center
                bg-blue-500/20 rounded-lg z-10 pointer-events-none"
            >
              <p className="text-white text-sm font-semibold">
                Drop files here (up to {MAX_GALLERY_FILES} files)
              </p>
            </div>
          )}
          <div
            className={`grid grid-cols-4 gap-2
              ${galleryFiles.length === 0 ? "!flex w-full" : ""}`}
          >
            {galleryFiles.map((file, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden bg-base-400 aspect-square"
              >
                {isImageFile(file) ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-base-300">
                    <FileText className="w-8 h-8 text-base-700 mb-1" />
                    <span className="text-xs text-base-700 text-center truncate w-full">
                      {file.name}
                    </span>
                    <span className="text-xs text-base-600 uppercase">
                      {getFileExtension(file.name).replace(".", "")}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full
                    hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => document.getElementById("gallery-upload")?.click()}
              className="w-full aspect-square rounded-lg h-39 bg-base-200
                cursor-pointer hover:bg-base-300 transition-colors flex flex-col
                items-center justify-center gap-2 border-1 border-dashed
                border-base-400 hover:border-base-700"
            >
              <FileUpload.Icon
                className="relative z-2 text-white"
                as={UploadCloudIcon}
              />
              <span className="text-white">Upload Media Assets</span>
              <span className="text-xs text-base-800">
                .png, .jpg, .svg, .pdf, .doc, .docx (up to {MAX_GALLERY_FILES}{" "}
                files)
              </span>
            </button>
          </div>
          <input
            id="gallery-upload"
            type="file"
            accept=".png,.jpg,.jpeg,.svg,.pdf,.doc,.docx,image/png,image/jpeg,image/svg+xml,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple
            tabIndex={-1}
            className="hidden"
            onChange={handleGalleryFileChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-base-700">
            {galleryFiles.length} / {MAX_GALLERY_FILES} files
          </span>
        </div>
      </div>
    </div>
  );
};
