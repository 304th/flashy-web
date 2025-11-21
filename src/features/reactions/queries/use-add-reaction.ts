import type { WritableDraft } from "immer";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { socialPostEntity } from "@/features/social/queries/use-social-post-by-id";
import { videoPostEntity } from "@/features/video/entities/video-post.entity";
import { videoSearchCollection } from "@/features/video/entities/video-search.collection";
import { topVideosCollection } from "@/features/video/entities/top-videos.collection";
import {profileSocialFeedCollection} from "@/features/profile/entities/profile-social-feed.collection";
import {channelSocialFeedCollection} from "@/features/channels/entities/channel-social-feed.collection";

export interface AddReactionParams {
  id: string;
  postType: PostType;
  reactionType: ReactionType;
  count?: number;
}

const addReaction = createMutation<AddReactionParams>({
  write: async (params) => {
    return await api
      .post("reactions/addReaction", {
        json: {
          postId: params.id,
          postType: params.postType,
          reactionType: params.reactionType,
          count: params.count ?? 1,
        },
      })
      .json();
  },
});

export const addReactionToSocialPost =
  (author: Author) => (post: WritableDraft<Optimistic<SocialPost>>) => {
    post.reactions = post.reactions || { like: {} };
    post.reactions.like = post.reactions.like || {};

    post.reactions.like[author.fbId] = {
      fbId: author.fbId,
      username: author.username,
      userimage: author.userimage,
    };
  };

export const addReactionToVideoPost =
  (author: Author) => (post: WritableDraft<Optimistic<VideoPost>>) => {
    post.reactions = post.reactions || { like: {} };
    post.reactions.like = post.reactions.like || {};

    post.reactions.like[author.fbId] = {
      fbId: author.fbId,
      username: author.username,
      userimage: author.userimage,
    };
  };

export const useAddReaction = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: addReaction,
    onOptimistic: async (channel, params) => {
      if (params.postType === "social") {
        return Promise.all([
          channel(socialFeedCollection).update(
            params.id,
            addReactionToSocialPost(author!),
          ),
          channel(profileSocialFeedCollection).update(
            params.id,
            addReactionToSocialPost(author!),
          ),
          channel(channelSocialFeedCollection).update(
            params.id,
            addReactionToSocialPost(author!),
          ),
          channel(socialPostEntity).update(
            params.id,
            addReactionToSocialPost(author!),
          ),
        ])
      } else if (params.postType === "video") {
        return Promise.all([
          channel(videoPostEntity).update(
            params.id,
            addReactionToVideoPost(author!),
          ),
          channel(videoSearchCollection).update(
            params.id,
            addReactionToVideoPost(author!),
          ),
          channel(topVideosCollection).update(
            params.id,
            addReactionToVideoPost(author!),
          ),
        ])
      }

      return Promise.all([]);// TODO: fix types
    },
  });
};
