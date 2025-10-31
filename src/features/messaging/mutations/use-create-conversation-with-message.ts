import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import {
  createConversation,
  type CreateConversationParams,
} from "@/features/messaging/mutations/use-create-conversation";
import {
  createMessage,
  type CreateMessageParams,
} from "@/features/messaging/mutations/use-create-message";
import { conversationsCollection } from "@/features/messaging/entities/conversations.collection";
import { conversationMessagesCollection } from "@/features/messaging/entities/conversation-messages.collection";
import { conversationMessagesWithUserCollection } from "@/features/messaging/entities/conversation-messages-with-user.collection";
import { useMe } from "@/features/auth/queries/use-me";

const createConversationWithMessage = createMutation<
  { conversation: CreateConversationParams; message: Pick<CreateMessageParams, "body" | "image" | "mentionedUsers"> },
  { conversation: Conversation; message: Message }
>({
  write: async (params) => {
    const conversation = await createConversation.write({
      members: params.conversation.members,
    });

    const message = await createMessage.write({
      conversationId: conversation._id,
      body: params.message.body,
      image: params.message.image,
      mentionedUsers: params.message.mentionedUsers,
    });

    return {
      conversation,
      message,
    };
  },
});

export const useCreateConversationWithMessage = () => {
  const { data: author } = useMe()

  return useOptimisticMutation({
    mutation: createConversationWithMessage,
    onOptimistic: async (ch, params) => {
      const conversationId = Math.floor(Math.random() * 100000000000).toString();
      const newMessage = {
        _id: Math.floor(Math.random() * 100000000000).toString(),
        conversationId,
        body: params.message.body,
        author,
      } as Message

      return Promise.all([
        ch(conversationsCollection).prepend({
          _id: conversationId,
          members: params.conversation.members.map((member) => ({
            fbId: member,
            username: '',
            userimage: '',
          })),
          hostID: author!.fbId,
          lastMessage: newMessage,
        }),
        ch(conversationMessagesWithUserCollection).prepend(newMessage),
      ])
    },
  });
};
