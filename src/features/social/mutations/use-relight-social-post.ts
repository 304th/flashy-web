import type { WritableDraft } from "immer";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { profileSocialFeedCollection } from "@/features/profile/entities/profile-social-feed.collection";
import { channelSocialFeedCollection } from "@/features/channels/entities/channel-social-feed.collection";

export interface RelightSocialPostParams {
  id: string;
  username: string;
  isRelighted: boolean;
}

const relightSocialPost = createMutation({
  write: async (params: RelightSocialPostParams) => {
    return api.post("social-posts/repost", {
      json: {
        _id: params.id,
        username: params.username,
        isRelited: params.isRelighted,
      },
    });
  },
});

export const relightSocialPostWithAuthor =
  (author: Author, params: RelightSocialPostParams) =>
  (post: WritableDraft<Optimistic<SocialPost>>) => {
    post.relitsCount += params.isRelighted ? 1 : -1;

    if (params.isRelighted) {
      post.relits = post.relits || {};
      post.relits[author.fbId] = true;
    } else if (!params.isRelighted) {
      delete post.relits?.[author.fbId];
    }
  };

export const useRelightSocialPost = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: relightSocialPost,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(socialFeedCollection).update(
          params.id,
          relightSocialPostWithAuthor(author!, params),
        ),
        ch(profileSocialFeedCollection).update(
          params.id,
          relightSocialPostWithAuthor(author!, params),
        ),
        ch(channelSocialFeedCollection).update(
          params.id,
          relightSocialPostWithAuthor(author!, params),
        ),
      ]);
    },
  });
};
