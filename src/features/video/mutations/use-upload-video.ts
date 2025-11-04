import { useRef } from "react";
import { VideoUploader } from "@api.video/video-uploader";
import { getMutation } from "@/lib/query-toolkit-v2";

export interface UploadVideoParams {
  file: File;
  uploadToken: string;
  videoId: string;
}

export const useUploadVideo = ({
  onProgress,
}: {
  onProgress: (progress: number) => void;
}) => {
  const isAbortedRef = useRef(false);
  const latestUploaderRef = useRef<VideoUploader | null>(null);

  const mutation = getMutation<{ videoId: string }, unknown, UploadVideoParams>(
    ["video", "upload"],
    async (params) => {
      isAbortedRef.current = false;

      const uploader = new VideoUploader(params);
      latestUploaderRef.current = uploader;

      uploader.onProgress((e) => {
        // Stop updating progress if aborted
        if (isAbortedRef.current) {
          return;
        }
        onProgress(Math.round((e.uploadedBytes * 100) / e.totalBytes));
      });

      try {
        // Note: VideoUploader doesn't support abort, so the upload will continue
        // in the background, but we'll ignore the result if aborted
        const result = await uploader.upload();

        if (isAbortedRef.current) {
          throw new Error("Upload was aborted");
        }

        return result;
      } catch (error) {
        if (isAbortedRef.current) {
          throw new Error("Upload was aborted");
        }

        throw error;
      }
    },
  );

  return Object.assign(mutation, {
    abort: () => {
      isAbortedRef.current = true;
      try {
        latestUploaderRef.current?.cancel?.();
      } catch {}
      mutation.reset();
    },
  });
};
