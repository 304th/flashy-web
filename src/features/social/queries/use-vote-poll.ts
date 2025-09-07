import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import {
  combineOptimisticUpdates,
  getMutation,
  handleOptimisticUpdateError,
} from "@/lib/query";
import { updateQueryData } from "@/features/social/queries/useSocialPosts";

export interface VotePollParams {
  postId: string;
  choiceId: number;
}

export const useVotePoll = () => {
  const queryClient = useQueryClient();

  return getMutation(
    ["votePoll"],
    async (params: VotePollParams) => {
      return;
      return api.post("social-posts/vote", {
        json: {
          postId: params.postId,
          choiceId: params.choiceId,
        },
      });
    },
    {
      onError: handleOptimisticUpdateError(queryClient),
      onMutate: combineOptimisticUpdates<VotePollParams>([
        updateQueryData<VotePollParams>(
          queryClient,
          (paginatedSocialPosts, params) => {
            return produce(paginatedSocialPosts, (draft) => {
              draft.pages.forEach((page) => {
                page.forEach((post) => {
                  if (post._id === params.postId) {
                    post.poll.pollVotedId = params.choiceId;
                    post.poll.results[params.choiceId - 1].votes += 1;
                  }
                });
              });
            });
          },
        ),
      ]),
    },
  );
};
