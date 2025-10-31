import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { conversationMessagesCollection } from "@/features/messaging/entities/conversation-messages.collection";

export interface CreateMessageParams {
  conversationId: string;
  body: string;
  tipAmount?: number;
  image?: string;
  mentionedUsers?: Partial<User>[];
  replyToMessageId?: string;
}

export const createMessage = createMutation<CreateMessageParams, Message>({
  write: async (params) => {
    return
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
      .json<{ data: Message }>();

    return data.data;
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
