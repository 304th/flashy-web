import type { WritableDraft } from "immer";
import { useOptimisticMutation, createMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { socialPostEntity } from "@/features/social/queries/use-social-post-by-id";
import { videoPostEntity } from "@/features/video/entities/video-post.entity";
import { videoSearchCollection } from "@/features/video/entities/video-search.collection";
import { topVideosCollection } from "@/features/video/entities/top-videos.collection";

export interface RemoveReactionParams {
  id: string;
  postType: PostType;
  reactionType: string;
}

const removeReaction = createMutation<RemoveReactionParams>({
  write: async (params) => {
    return await api
      .delete("reactions/deleteReaction", {
        json: {
          postId: params.id,
          postType: params.postType,
          reactionType: params.reactionType,
        },
      })
      .json();
  },
});

export const deleteReactionFromSocialPost =
  (author: Author) => (post: WritableDraft<Optimistic<SocialPost>>) => {
    delete post.reactions.like[author.fbId];
  };

export const deleteReactionFromVideoPost =
  (author: Author) => (post: WritableDraft<Optimistic<VideoPost>>) => {
    delete post.reactions.like[author.fbId];
  };

export const useRemoveReaction = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: removeReaction,
    onOptimistic: (channel, params) => {
      const updates = [];

      if (params.postType === "social") {
        updates.push(
          channel(socialFeedCollection).update(
            params.id,
            deleteReactionFromSocialPost(author!),
          ),
          channel(socialPostEntity).update(
            params.id,
            deleteReactionFromSocialPost(author!),
          ),
        );
      } else if (params.postType === "video") {
        updates.push(
          channel(videoPostEntity).update(
            params.id,
            deleteReactionFromVideoPost(author!),
          ),
          channel(videoSearchCollection).update(
            params.id,
            deleteReactionFromVideoPost(author!),
          ),
          channel(topVideosCollection).update(
            params.id,
            deleteReactionFromVideoPost(author!),
          ),
        );
      }

      return Promise.all(updates);
    },
  });
};
