import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";
import { api } from "@/services/api";

export interface PinSocialPostParams {
  id: string;
  pinned: boolean;
}

const pinSocialPost = createMutation({
  writeToSource: async (params: PinSocialPostParams) => {
    return api.post(`social-posts/${params.id}/pinned`, {
      json: {
        pinned: params.pinned,
      },
    });
  },
});

export const usePinSocialPost = ({
  optimisticUpdates,
}: { optimisticUpdates?: OptimisticUpdate<PinSocialPostParams>[] } = {}) => {
  return useOptimisticMutation({
    mutation: pinSocialPost,
    optimisticUpdates,
  });
};

// import { produce } from "immer";
// import { useQueryClient } from "@tanstack/react-query";
// import { getMutation, handleOptimisticUpdateError } from "@/lib/query-toolkit";
// import { optimisticUpdateSocialPosts } from "@/features/social/queries/use-social-posts";
// import { api } from "@/services/api";
// import { useMe } from "@/features/auth/queries/use-me";
//
// export interface PinSocialPostParams {
//   id: string;
//   pinned: boolean;
// }
//
// export const usePinSocialPost = () => {
//   const [me] = useMe();
//   const queryClient = useQueryClient();
//
//   return getMutation(
//     ["pinSocialPost"],
//     async (params: PinSocialPostParams) => {
//       return api.post(`social-posts/${params.id}/pinned`, {
//         json: {
//           pinned: params.pinned,
//         },
//       });
//     },
//     {
//       onError: handleOptimisticUpdateError(queryClient),
//       onMutate: optimisticUpdateSocialPosts<PinSocialPostParams>(
//         queryClient,
//         (paginatedSocialPosts, params) => {
//           return produce(paginatedSocialPosts, (draft) => {
//             draft.pages.forEach((page, index) => {
//               page.forEach((post) => {
//                 if (post.pinned) {
//                   post.pinned = false;
//                   delete post.pinnedBy;
//                 }
//               });
//
//               if (params.pinned) {
//                 const foundIndex = page.findIndex(
//                   (post) => post._id === params.id,
//                 );
//
//                 if (foundIndex !== -1) {
//                   draft.pages[index][foundIndex].pinned = params.pinned;
//
//                   if (params.pinned) {
//                     draft.pages[index][foundIndex].pinnedBy = {
//                       userId: me!.fbId,
//                       username: me!.username,
//                     };
//
//                     [draft.pages[0][0], draft.pages[index][foundIndex]] = [
//                       draft.pages[index][foundIndex],
//                       draft.pages[0][0],
//                     ]; //Move to the very top place
//                   } else {
//                     delete draft.pages[index][foundIndex].pinnedBy;
//                   }
//                 }
//               }
//             });
//           });
//         },
//         me?.fbId,
//       ),
//     },
//   );
// };
