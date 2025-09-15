// import { useQueryClient } from "@tanstack/react-query";
// import { produce } from "immer";
// import { useMe } from "@/features/auth/queries/use-me";
// import { optimisticUpdateComments } from "@/features/comments/queries/use-comments";
// import { optimisticUpdateReplies } from "@/features/comments/queries/use-replies";
// import type { CreateReplyParams } from "@/features/comments/queries/use-create-reply";
// import { createOptimisticReply } from "@/features/comments/utils/create-optimistic-reply";
// import { combineOptimisticUpdates, OptimisticUpdater } from "@/lib/query";
//
// export const useCreateReplyMutate = (
//   postId: string,
//   commentId?: string,
//   mutates?: OptimisticUpdater[],
// ) => {
//   const [me] = useMe();
//   const queryClient = useQueryClient();
//
//   if (!commentId) return [];
//
//   const updates = [
//     optimisticUpdateReplies<CreateReplyParams>(
//       queryClient,
//       (paginatedComments, params) => {
//         return produce(paginatedComments, (draft) => {
//           draft.unshift(createOptimisticReply(params, me!));
//         });
//       },
//       commentId,
//     ),
//     optimisticUpdateComments<CreateReplyParams>(
//       queryClient,
//       (paginatedComments, params) => {
//         return produce(paginatedComments, (draft) => {
//           draft.pages.forEach((page) => {
//             page.forEach((comment) => {
//               if (comment._id === params.commentId) {
//                 comment.repliesCount += 1;
//               }
//             });
//           });
//         });
//       },
//       postId,
//     ),
//   ];
//
//   if (mutates) {
//     updates.push(...(mutates.filter(Boolean) as OptimisticUpdater[]));
//   }
//
//   return combineOptimisticUpdates<CreateReplyParams>(updates);
// };
