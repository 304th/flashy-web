import type { WritableDraft } from "immer";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import type { VotePollParams } from "@/features/social/mutations/use-vote-poll";

export const votePoll =
  (params: VotePollParams) => (post: WritableDraft<Optimistic<SocialPost>>) => {
    post.poll.pollVotedId = params.choiceId;
    post.poll.results[params.choiceId - 1].votes += 1;
  };

export const useSocialFeedVotePollUpdates = () => {
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return [
    async (params: VotePollParams) => {
      return await socialFeed.update(params.postId, votePoll(params));
    },
  ];
};
