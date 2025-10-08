import type {WritableDraft} from "immer";
import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { api } from "@/services/api";
import { socialFeedCollectionV2 } from "@/features/social/collections/social-feed";

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

export const pinPost =
  (author: Author, params: PinSocialPostParams) =>
    (post: WritableDraft<Optimistic<SocialPost>>) => {
      if (params.pinned) {
        post.pinned = true;
        post.pinnedBy = {
          userId: author!.fbId,
          username: author!.username,
        };
      } else {
        post.pinned = false;
        delete post.pinnedBy;
      }
    };

export const usePinSocialPost = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: pinSocialPost,
    onOptimistic: (ch, params) => {
      return ch(socialFeedCollectionV2).update(params.id, pinPost(author!, params))
    }
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
