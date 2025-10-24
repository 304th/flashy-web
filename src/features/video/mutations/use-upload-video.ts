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
  return getMutation<{ videoId: string }, unknown, UploadVideoParams>(
    ["video", "upload"],
    async (params) => {
      const uploader = new VideoUploader(params);

      uploader.onProgress((e) =>
        onProgress(Math.round((e.uploadedBytes * 100) / e.totalBytes)),
      );

      return await uploader.upload();
    },
  );
};
