// import { useQueryClient } from "@tanstack/react-query";
// import { produce } from "immer";
// import { optimisticUpdateReplies } from "@/features/comments/queries/use-replies";
// import type { AddLikeParams } from "@/features/reactions/queries/use-add-like";
//
// export const useLikeReplyMutate = (commentId: string) => {
//   const queryClient = useQueryClient();
//
//   return optimisticUpdateReplies<AddLikeParams>(
//     queryClient,
//     (replies, params) => {
//       return produce(replies, (draft) => {
//         draft.forEach((reply) => {
//           if (reply._id === params.id) {
//             reply.isLiked = params.isLiked;
//             reply.likesCount += params.isLiked ? 1 : -1;
//           }
//         });
//       });
//     },
//     commentId,
//   );
// };
