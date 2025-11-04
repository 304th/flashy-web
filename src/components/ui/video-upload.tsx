import config from "@/config";
import { useEffect, useMemo, useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { IconButton } from "@/components/ui/icon-button";
import { TrashIcon } from "@/components/ui/icons/trash";
import { formatBytes } from "@/lib/utils";
import { CircularProgress } from "@/components/ui/circular-progress";

export interface VideoUploadProps {
  accept?: string;
  maxAllowedSize?: number;
  title?: string;
  description?: string;
  initialPreview?: string;
  withBrowseButton?: boolean;
  className?: string;
  onChange: (file: File | null) => void;
  onError?: (error: string) => void;
  uploadProgress?: number; // 0..1
  uploading?: boolean;
}

export const VideoUpload = ({
  accept = "video/x-msvideo,video/avi,video/mp4,video/quicktime",
  maxAllowedSize = config.content.uploads.video.maxSize,
  title,
  description,
  initialPreview,
  withBrowseButton = false,
  className,
  onChange,
  onError,
  uploadProgress,
  uploading,
}: VideoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(
    () => initialPreview ?? null,
  );
  const formattedSizeLimit = useMemo(
    () => formatBytes(maxAllowedSize, 0),
    [maxAllowedSize],
  );

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFilesUpload = (files: File[]) => {
    const file = files[0];

    if (!file) {
      return;
    }

    if (file.type && !file.type.startsWith("video/")) {
      return onError?.("Only video files are allowed.");
    }

    if (file.size > maxAllowedSize) {
      return onError?.(`File size must be less than ${formattedSizeLimit}.`);
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
      {!preview && (
        <div
          className="absolute inset-0 flex flex-col justify-center items-center
            gap-4"
        >
          <FileUpload.Icon
            className="relative z-2 text-white size-8"
            as={UploadCloudIcon}
          />
          <div className="relative space-y-1.5 z-2">
            {title && <div className="text-label-sm text-white">{title}</div>}
            {description && (
              <div className="text-paragraph-xs text-white">{description}</div>
            )}
            <p className="text-xs">Up to {formattedSizeLimit}</p>
          </div>
          {withBrowseButton && (
            <FileUpload.Button className="relative z-2 text-white">
              Browse File
            </FileUpload.Button>
          )}
        </div>
      )}
      {preview && (
        <div className="absolute inset-0 z-1 saturate-50 brightness-50">
          <video
            className="w-full h-full object-cover rounded-md"
            src={preview}
            muted
            autoPlay
            loop
          />
        </div>
      )}
      {preview && (
        <div className="absolute top-2 right-2 z-2">
          <IconButton
            type="button"
            variant="destructive"
            disabled={uploading}
            onClick={(e) => {
              e.preventDefault();
              if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
              }
              setPreview(null);
              onChange(null);
            }}
          >
            <TrashIcon />
          </IconButton>
        </div>
      )}
      {uploading && typeof uploadProgress === "number" && (
        <div
          className="absolute inset-0 z-3 flex items-center justify-center
            bg-black/50"
        >
          <div className="flex flex-col items-center gap-3">
            <CircularProgress
              value={uploadProgress}
              diameter={56}
              color="#fff"
              strokeWidth={6}
            />
            <span className="text-white text-sm">
              {Math.round(uploadProgress * 100)}%
            </span>
          </div>
        </div>
      )}
    </FileUpload.Root>
  );
};
