import { api } from "@/services/api";
import { getMutation } from "@/lib/query-toolkit-v2";

export const useCreateVideoOptions = () => {
  return getMutation(['video', 'generateToken'], async () => {
    return api.post('video/upload').json<VideoUploadOptions>();
  })
}