import { config } from "@/services/config";
import { toast } from "sonner";
import { UseFormGetValues, UseFormSetValue, FieldValues } from "react-hook-form";

export const useImageUpload = <T extends FieldValues>({
  setValue,
  getValues,
  fieldName = "images",
}: {
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  fieldName?: keyof T;
}) => {
  const handleFilesUpload = (files: File[]) => {
    if (files.length === 0) return;

    const maxSize = config.content.uploads.maxSize;
    const validFiles: File[] = [];
    let hasError = false;

    for (const file of files) {
      if (file.type && !file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image.`);
        hasError = true;
        continue;
      }

      if (file.size > maxSize) {
        toast.error(`File "${file.name}" size must be less than ${maxSize / (1024 * 1024)} MB.`);
        hasError = true;
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      const currentImages = getValues(fieldName) || [];
      setValue(fieldName, [...currentImages, ...validFiles], {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else if (!hasError) {
      toast.error("No valid files selected.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesUpload(Array.from(e.target.files));
      e.target.value = ""; // Reset input to allow selecting same file again
    }
  };

  return {
    handleFilesUpload,
    handleFileChange,
  };
};