import { useState } from "react";
import {
  useGetPresignedUrl,
  uploadToPresignedUrl,
} from "../mutations/use-get-presigned-urls";

interface UploadProgress {
  total: number;
  completed: number;
  percentage: number;
}

interface UseUploadDeliverablesReturn {
  upload: (opportunityId: string, files: File[]) => Promise<SubmissionFile[]>;
  isUploading: boolean;
  progress: UploadProgress;
  error: Error | null;
}

export const useUploadDeliverables = (): UseUploadDeliverablesReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    percentage: 0,
  });
  const [error, setError] = useState<Error | null>(null);

  const getPresignedUrl = useGetPresignedUrl();

  const upload = async (
    opportunityId: string,
    files: File[],
  ): Promise<SubmissionFile[]> => {
    if (files.length === 0) return [];

    setIsUploading(true);
    setError(null);
    setProgress({ total: files.length, completed: 0, percentage: 0 });

    try {
      const uploadedFiles: SubmissionFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Get presigned URL for this file
        const presignedResponse = await getPresignedUrl.mutateAsync({
          opportunityId,
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        });

        // Upload file to presigned URL
        await uploadToPresignedUrl(
          presignedResponse.uploadUrl,
          file,
          file.type || "application/octet-stream",
        );

        uploadedFiles.push({
          url: presignedResponse.fileUrl,
          filename: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
        });

        setProgress({
          total: files.length,
          completed: i + 1,
          percentage: Math.round(((i + 1) / files.length) * 100),
        });
      }

      setIsUploading(false);
      return uploadedFiles;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Upload failed");
      setError(error);
      setIsUploading(false);
      throw error;
    }
  };

  return {
    upload,
    isUploading,
    progress,
    error,
  };
};
