import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { streamChatCollection } from "@/features/streams/entities/stream-chat.collection";

export interface SendChatMessageParams {
  streamId: string;
  message: string;
}

const sendChatMessageMutation = createMutation<
  SendChatMessageParams,
  ChatMessage
>({
  write: async (params) => {
    return api
      .post(`streaming/${params.streamId}/chat`, {
        json: { message: params.message },
      })
      .json<ChatMessage>();
  },
});

export const useSendChatMessage = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: sendChatMessageMutation,
    onOptimistic: async (ch, params) => {
      const optimisticMessage = {
        streamId: params.streamId,
        user: {
          fbId: author!.fbId,
          username: author!.username,
          userimage: author!.userimage,
        },
        message: params.message,
      };

      return ch(streamChatCollection).prepend(optimisticMessage, {
        sync: true,
      });
    },
  });
};
