import { api } from "@/services/api";
import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";

export interface VotePollParams {
  postId: string;
  choiceId: number;
}

const votePollMutation = createMutation<VotePollParams>({
  writeToSource: async (params) => {
    return api.post("social-posts/vote", {
      json: {
        postId: params.postId,
        choiceId: params.choiceId,
      },
    });
  },
});

export const useVotePoll = ({
  optimisticUpdates,
}: { optimisticUpdates?: OptimisticUpdate<VotePollParams>[] } = {}) => {
  return useOptimisticMutation<VotePollParams, unknown>({
    mutation: votePollMutation,
    optimisticUpdates,
  });
};

// import { produce } from "immer";
// import { useQueryClient } from "@tanstack/react-query";
// import { api } from "@/services/api";
// import { useMe } from "@/features/auth/queries/use-me";
// import {
//   combineOptimisticUpdates,
//   getMutation,
//   handleOptimisticUpdateError,
// } from "@/lib/query-toolkit";
// import { optimisticUpdateSocialPosts } from "@/features/social/queries/use-social-posts";
//
// export interface VotePollParams {
//   postId: string;
//   choiceId: number;
// }
//
// export const useVotePoll = () => {
//   const [me] = useMe();
//   const queryClient = useQueryClient();
//
//   return getMutation(
//     ["votePoll"],
//     async (params: VotePollParams) => {
//       return; //TODO: Check implementation
//       return api.post("social-posts/vote", {
//         json: {
//           postId: params.postId,
//           choiceId: params.choiceId,
//         },
//       });
//     },
//     {
//       onError: handleOptimisticUpdateError(queryClient),
//       onMutate: combineOptimisticUpdates<VotePollParams>([
//         optimisticUpdateSocialPosts<VotePollParams>(
//           queryClient,
//           (paginatedSocialPosts, params) => {
//             return produce(paginatedSocialPosts, (draft) => {
//               draft.pages.forEach((page) => {
//                 page.forEach((post) => {
//                   if (post._id === params.postId) {
//                     post.poll.pollVotedId = params.choiceId;
//                     post.poll.results[params.choiceId - 1].votes += 1;
//                   }
//                 });
//               });
//             });
//           },
//           me?.fbId,
//         ),
//       ]),
//     },
//   );
// };
