import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { streamChatCollection } from "@/features/streams/entities/stream-chat.collection";

export interface DeleteStreamChatMessageParams {
  messageId: string;
}

const deleteChatMessageMutation = createMutation<
  DeleteStreamChatMessageParams,
  { id: string }
>({
  write: async (params) => {
    return api
      .delete(`streaming/chat/message/${params.messageId}`)
      .json<{ id: string }>();
  },
});

export const useDeleteStreamChatMessage = () => {
  return useOptimisticMutation({
    mutation: deleteChatMessageMutation,
    onOptimistic: async (ch, params) => {
      return ch(streamChatCollection).filter(
        (message) => message._id !== params.messageId,
      );
    },
  });
};
