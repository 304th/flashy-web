import { useState } from "react";
import { useGetPresignedUrls, uploadToPresignedUrl } from "../mutations/use-get-presigned-urls";

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

  const getPresignedUrls = useGetPresignedUrls();

  const upload = async (
    opportunityId: string,
    files: File[]
  ): Promise<SubmissionFile[]> => {
    if (files.length === 0) return [];

    setIsUploading(true);
    setError(null);
    setProgress({ total: files.length, completed: 0, percentage: 0 });

    try {
      // Get presigned URLs for all files
      const { urls } = await getPresignedUrls.mutateAsync({
        opportunityId,
        files: files.map((file) => ({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        })),
      });

      // Upload each file to its presigned URL
      const uploadedFiles: SubmissionFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const urlData = urls[i];

        await uploadToPresignedUrl(urlData.uploadUrl, file, urlData.contentType);

        uploadedFiles.push({
          url: urlData.fileUrl,
          filename: urlData.originalFilename,
          type: urlData.contentType,
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
