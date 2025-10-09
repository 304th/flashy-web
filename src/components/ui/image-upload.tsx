import config from "@/config";
import { useMemo, useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { IconButton } from "@/components/ui/icon-button";
import { TrashIcon } from "@/components/ui/icons/trash";
import { formatBytes } from "@/lib/utils";

export interface ImageUploadProps {
  accept?: string;
  maxAllowedSize?: number;
  title?: string;
  description?: string;
  initialPreview?: string;
  withBrowseButton?: boolean;
  className?: string;
  onChange: (file: File | null) => void;
  onError?: (error: string) => void;
}

export const ImageUpload = ({
  accept = "image/jpeg,image/png,image/jpg,image/gif",
  maxAllowedSize = config.content.uploads.maxSize,
  title,
  description,
  initialPreview,
  withBrowseButton = false,
  className,
  onChange,
  onError,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(
    () => initialPreview ?? null,
  );
  const formattedSizeLimit = useMemo(
    () => formatBytes(maxAllowedSize, 0),
    [maxAllowedSize],
  );

  const handleFilesUpload = (files: File[]) => {
    const file = files[0];

    if (!file) {
      return;
    }

    if (file.size > maxAllowedSize) {
      return onError?.("File size must be less than 2 MB.");
    }

    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <FileUpload.Root
      className={`relative ${className}`}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFilesUpload(Array.from(e.dataTransfer.files));
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <input
        type="file"
        accept={accept}
        tabIndex={-1}
        className="hidden"
        onChange={(e) => {
          handleFilesUpload(Array.from(e.target.files || []));
        }}
      />
      <FileUpload.Icon
        className="relative z-2 text-white"
        as={UploadCloudIcon}
      />
      <div className="relative space-y-1.5 z-2">
        {title && <div className="text-label-sm text-white">{title}</div>}
        {description && (
          <div className="text-paragraph-xs text-white">{description}</div>
        )}
        <p className="text-xs text-white">Up to {formattedSizeLimit}</p>
      </div>
      {withBrowseButton && (
        <FileUpload.Button className="relative z-2 text-white">
          Browse File
        </FileUpload.Button>
      )}
      {preview && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat z-1
          opacity-40 ${className}`}
          style={{ backgroundImage: `url(${preview})` }}
        />
      )}
      {preview && (
        <div className="absolute top-2 right-2 z-1">
          <IconButton
            type="button"
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              setPreview(null);
              onChange(null);
            }}
          >
            <TrashIcon />
          </IconButton>
        </div>
      )}
    </FileUpload.Root>
  );
};
