import type { ChangeEvent } from "react";
import config from "@/config";
import { toast } from "sonner";
import type {
  UseFormGetValues,
  UseFormSetValue,
  FieldValues,
} from "react-hook-form";

export const useSocialPostImagesAttach = <T extends FieldValues>({
  fieldName = "images",
  maxSize = config.content.uploads.maxSize,
  setValue,
  getValues,
}: {
  fieldName?: keyof T;
  maxSize?: number;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
}) => {
  const handleFilesUpload = (files: File[]) => {
    if (files.length === 0) return;

    const validFiles: File[] = [];
    let hasError = false;

    for (const file of files) {
      if (file.type && !file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image.`);
        hasError = true;
        continue;
      }

      if (file.size > maxSize) {
        toast.error(
          `File "${file.name}" size must be less than ${maxSize / (1024 * 1024)} MB.`,
        );
        hasError = true;
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      // FIXME: fix types
      const currentImages = getValues(fieldName as any) || [];
      setValue(fieldName as any, [...currentImages, ...validFiles] as any, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else if (!hasError) {
      toast.error("No valid files selected.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesUpload(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  return {
    handleFilesUpload,
    handleFileChange,
  };
};
