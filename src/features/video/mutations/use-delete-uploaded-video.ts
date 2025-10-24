import { getMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export interface DeleteUploadedVideoParams {
  videoId: string;
}

export const useDeleteUploadedVideo = () => {
  return getMutation<unknown, unknown, DeleteUploadedVideoParams>(
    ["video", "upload"],
    async (params) => {
      return api.delete(`video/upload/${params.videoId}`).json();
    },
  );
};
