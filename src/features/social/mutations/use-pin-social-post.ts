import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { api } from "@/services/api";
import { socialFeedCollection } from "@/features/social/collections/social-feed";

export interface PinSocialPostParams {
  id: string;
  pinned: boolean;
}

const pinSocialPost = createMutation({
  write: async (params: PinSocialPostParams) => {
    return api.post(`social-posts/${params.id}/pinned`, {
      json: {
        pinned: params.pinned,
      },
    });
  },
});

export const usePinSocialPost = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: pinSocialPost,
    onOptimistic: (ch, params) => {
      return ch(socialFeedCollection).update(params.id, (post) => {
        if (params.pinned) {
          post.pinned = true;
          post.pinnedBy = {
            userId: author!.fbId,
            username: author!.username,
          };
        } else {
          post.pinned = false;
          delete post.pinnedBy;
        }
      });
    },
  });
};
