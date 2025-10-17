import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";

export interface CreateVideoPostParams {
  title: string;
  description?: string;
  thumbnail: string;
  price?: number;
  videoId: string;
}

const videoCreateMutation = createMutation<CreateVideoPostParams>({
  write: async (params) => {
    return api.post('v2/story', {
      json: params,
    })
  }
})

export const useCreateVideoPost = () => {
  return useOptimisticMutation({
    mutation: videoCreateMutation,
  })
}