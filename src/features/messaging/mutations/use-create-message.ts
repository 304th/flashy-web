import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { conversationMessagesCollection } from "@/features/messaging/entities/conversation-message.collection";

export interface CreateMessageParams {
  conversationId: string;
  body: string;
  tipAmount?: number;
  image?: string;
  mentionedUsers?: Partial<User>[];
  replyToMessageId?: string;
}

const createMessage = createMutation<CreateMessageParams>({
  write: async (params) => {
    const data = await api
      .post(`conversations/${params.conversationId}/messages`, {
        json: {
          body: params.body,
          tipAmount: params.tipAmount,
          image: params.image,
          mentionedUsers: params.mentionedUsers,
          replyToMessageId: params.replyToMessageId,
        },
      })
      .json<{ response: CommentPost }>();

    return data.response;
  },
});

export const useCreateMessage = () => {
  return useOptimisticMutation({
    mutation: createMessage,
    onOptimistic: async (ch, params) => {
      return ch(conversationMessagesCollection).prepend(params);
    },
  });
};
