import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { profileConversationsCollection } from "@/features/profile/entities/profile-conversations.collection";
import { conversationMessagesCollection } from "@/features/messaging/entities/conversation-messages.collection";
import { messageSchema } from "@/features/messaging/schemas/message.schema";
import { useMe } from "@/features/auth/queries/use-me";
import {timeout} from "@/lib/utils";

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
    await timeout()
    throw '';

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
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: createMessage,
    onOptimistic: async (ch, params) => {
      const message = messageSchema.createEntityFromParams({
        author: {
          fbId: author!.fbId,
          username: author!.username,
          userimage: author!.userimage,
        },
        ...params,
      });

      return Promise.all([
        ch(profileConversationsCollection).update(
          params.conversationId,
          (conversation) => {
            conversation.lastMessage = message;
          },
        ),
        ch(conversationMessagesCollection).prepend(message, {
          rollback: false,
        }),
      ]);
    },
  });
};
