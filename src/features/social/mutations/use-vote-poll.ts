import type { WritableDraft } from "immer";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { socialPostEntity } from "@/features/social/queries/use-social-post-by-id";

export interface VotePollParams {
  postId: string;
  choiceId: number;
}

const votePollMutation = createMutation<VotePollParams>({
  write: async (params) => {
    return api.post("social-posts/vote", {
      json: {
        postId: params.postId,
        choiceId: params.choiceId,
      },
    });
  },
});

export const votePoll =
  (params: VotePollParams) => (post: WritableDraft<Optimistic<SocialPost>>) => {
    post.poll.pollVotedId = params.choiceId;
    post.poll.results[params.choiceId - 1].votes += 1;
  };

export const useVotePoll = () => {
  return useOptimisticMutation<VotePollParams, unknown>({
    mutation: votePollMutation,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(socialFeedCollection).update(params.postId, votePoll(params)),
        ch(socialPostEntity).update(votePoll(params)),
      ]);
    },
  });
};
