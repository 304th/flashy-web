// import { produce } from "immer";
// import { useQueryClient } from "@tanstack/react-query";
// import { optimisticUpdateSocialPosts } from "@/features/social/queries/use-social-posts";
// import { useMe } from "@/features/auth/queries/use-me";
// import type { RelightSocialPostParams } from "@/features/social/queries/use-relight-social-post";
//
// export const useRelightSocialPostMutate = () => {
//   const [me] = useMe();
//   const queryClient = useQueryClient();
//
//   return optimisticUpdateSocialPosts<RelightSocialPostParams>(
//     queryClient,
//     (paginatedSocialsPosts, params) => {
//       return produce(paginatedSocialsPosts, (draft) => {
//         draft.pages.forEach((page) => {
//           page.forEach((post) => {
//             if (post._id === params.id) {
//               post.relitsCount += params.isRelighted ? 1 : -1;
//
//               if (params.isRelighted) {
//                 post.relits = post.relits || {};
//                 post.relits[me!.fbId] = true;
//               } else if (!params.isRelighted) {
//                 delete post.relits?.[me!.fbId];
//               }
//             }
//           });
//
//           if (!params.isRelighted) {
//             const index = page.findIndex(
//               (post) => post._id === params.id && post.relightedPost,
//             );
//
//             if (index !== -1) {
//               page.splice(index, 1);
//             }
//           }
//         });
//       });
//     },
//     me?.fbId,
//   );
// };
