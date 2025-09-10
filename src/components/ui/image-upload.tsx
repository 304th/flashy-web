import { config } from "@/services/config";
import { useMemo, useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { IconButton } from "@/components/ui/icon-button";
import { TrashIcon } from "@/components/ui/icons/trash";
import { formatBytes } from "@/lib/utils";

export interface ImageUploadProps {
  accept?: string;
  maxAllowedSize: number;
  onChange: (file: File | null) => void;
  onError(error: string): void;
}

export const ImageUpload = ({
  accept = "image/jpeg,image/png,image/jpg,image/gif",
  maxAllowedSize = config.content.uploads.maxSize,
  onChange,
  onError,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
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
      return onError("File size must be less than 2 MB.");
    }

    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <FileUpload.Root
      className="relative overflow-hidden"
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
      <FileUpload.Icon className="relative z-1" as={UploadCloudIcon} />
      <div className="relative space-y-1.5 z-1">
        <div className="text-label-sm text-text-strong-950">
          Choose an image or drag & drop it here.
        </div>
        <div className="text-paragraph-xs text-text-sub-600">
          JPEG, PNG, GIF formats, up to {formattedSizeLimit}.
        </div>
      </div>
      <FileUpload.Button>Browse File</FileUpload.Button>
      {preview && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-1"
          style={{ backgroundImage: `url(${preview})` }}
        />
      )}
      {preview && (
        <div className="absolute top-2 right-2 z-1">
          <IconButton
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
