import { api } from "@/services/api";
import { createMutation } from "@/lib/query-toolkit/mutation";
import {
  type OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";

export interface RelightSocialPostParams {
  id: string;
  username: string;
  isRelighted: boolean;
}

const relightSocialPost = createMutation({
  writeToSource: async (params: RelightSocialPostParams) => {
    return api.post("social-posts/repost", {
      json: {
        _id: params.id,
        username: params.username,
        isRelited: params.isRelighted,
      },
    });
  },
});

export const useRelightSocialPost = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<RelightSocialPostParams>[];
}) => {
  return useOptimisticMutation({
    mutation: relightSocialPost,
    optimisticUpdates,
  });
};
