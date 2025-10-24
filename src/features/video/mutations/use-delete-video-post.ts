import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { profileVideoFeedDraftsCollection } from "@/features/profile/entities/profile-video-feed-drafts.collection";

export interface DeleteVideoParams {
  fbId: string;
}

const deleteSocialPost = createMutation<DeleteVideoParams>({
  write: async (params) => {
    api.post(`deleteStory`, {
      json: {
        key: params.fbId,
        story: {},
      },
    });
  },
});

export const useDeleteVideoPost = () => {
  return useOptimisticMutation({
    mutation: deleteSocialPost,
    onOptimistic: (ch, params) => {
      return ch(profileVideoFeedDraftsCollection).delete(params.fbId);
    },
  });
};
