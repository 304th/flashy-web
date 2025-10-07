import { api } from "@/services/api";
import { createMutation } from "@/lib/query-toolkit/mutation";
import {
  type OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";
import {
  createMutation as createMutationV2,
  useOptimisticMutation as useOptimisticMutationV2,
} from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollectionV2 } from "@/features/social/collections/social-feed";
import { socialPostEntityV2 } from "@/features/social/queries/use-social-post-by-id";

export interface AddReactionParams {
  id: string;
  postType: PostType;
  reactionType: ReactionType;
  count?: number;
}

const addReaction = createMutation<AddReactionParams>({
  writeToSource: async (params) => {
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

const timeout = () => new Promise(resolve => setTimeout(resolve, 1000));

const addReactionV2 = createMutationV2<AddReactionParams>({
  writeToSource: async (params) => {
    await timeout()
    return
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

export const useAddReaction = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<AddReactionParams>[];
}) => {
  return useOptimisticMutation({
    mutation: addReaction,
    optimisticUpdates,
  });
};

export const useAddReactionV2 = () => {
  const { data: author } = useMe();

  return useOptimisticMutationV2({
    mutation: addReactionV2,
    onOptimistic: async (channel, params) => {
      return Promise.all([
        channel(socialFeedCollectionV2).update(params.id, (post) => {
          post.reactions = post.reactions || { like: {} };
          post.reactions.like = post.reactions.like || {};

          post.reactions.like[author!.fbId] = {
            fbId: author!.fbId,
            username: author!.username,
            userimage: author!.userimage,
          };
        }),
        channel(socialPostEntityV2).update(params.id, (post) => {
          post.reactions = post.reactions || { like: {} };
          post.reactions.like = post.reactions.like || {};

          post.reactions.like[author!.fbId] = {
            fbId: author!.fbId,
            username: author!.username,
            userimage: author!.userimage,
          };
        })
      ])

      // return Promise.all([
      //   channel(socialFeedCollectionV2).update(params.id, (post) => {
      //     post.reactions = post.reactions || { like: {} };
      //     post.reactions.like = post.reactions.like || {};
      //
      //     post.reactions.like[author!.fbId] = {
      //       fbId: author!.fbId,
      //       username: author!.username,
      //       userimage: author!.userimage,
      //     };
      //   })
      // ])
    },
  });
};
