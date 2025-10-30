import { api } from "@/services/api";
import { useOptimisticMutation, createMutation } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";

export interface CreateConversationParams {
  members: string[];
}

const createConversation = createMutation({
  write: async (params: CreateConversationParams) => {
    const data = await api
      .post("conversations", {
        json: {
          members: params.members,
        },
      })
      .json<{ response: any }>();

    return data.response;
  },
});

export const useCreateConversation = () => {
  // const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: createConversation,
    // onOptimistic: (ch, params) => {
    //   return Promise.all([
    //     ch(commentsCollection).prepend(
    //       {
    //         ...params,
    //         created_by: {
    //           _id: author!.fbId,
    //           username: author!.username,
    //           userimage: author!.userimage,
    //         },
    //       },
    //       { sync: true },
    //     ),
    //     ch(socialFeedCollection).update(params.postId, (post) => {
    //       post.commentsCount += 1;
    //     }),
    //   ]);
    // },
  });
};
