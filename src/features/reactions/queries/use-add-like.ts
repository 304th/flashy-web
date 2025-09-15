import { api } from "@/services/api";
import {createMutation} from "@/lib/mutation";
import {type OptimisticUpdate, useOptimisticMutation} from "@/lib/query.v3";

export interface AddLikeParams {
  id: string;
  isLiked: boolean;
}

const addLike = createMutation<AddLikeParams>({
  writeToSource: async (params) => {
    return await api
      .post("comment/like", {
        json: {
          _id: params.id,
          isLiked: params.isLiked,
        },
      })
      .json();
  }
})

export const useAddLike = ({ optimisticUpdates }: { optimisticUpdates?: OptimisticUpdate<AddLikeParams>[] }) => {
  return useOptimisticMutation({
    mutation: addLike,
    optimisticUpdates,
  })
}
