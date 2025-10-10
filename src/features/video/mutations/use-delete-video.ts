import { getMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export interface DeleteVideoParams {
  videoId: string,
}

export const useDeleteVideo = () => {
  return getMutation<unknown, unknown, DeleteVideoParams>(['video', 'upload'], async (params) => {
    return api.delete(`video/upload/${params.videoId}`).json<VideoUploadToken>();
  });
}