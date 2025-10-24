import { createEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const videoPostEntity = createEntity<VideoPost, { id: string }>({
  sourceFrom: async (params) => {
    return await api.get(`video-details/${params?.id!}`).json<VideoPost>();
  },
  name: "videoPost",
});
