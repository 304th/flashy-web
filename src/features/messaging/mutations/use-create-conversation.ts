import { useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useOptimisticMutation, createMutation } from "@/lib/query-toolkit-v2";
import { profileConversationsCollection } from "@/features/profile/entities/profile-conversations.collection";
import { useMe } from "@/features/auth/queries/use-me";
import { nonce, timeout } from "@/lib/utils";

export interface CreateConversationParams {
  members: Author[];
}

export const createConversation = createMutation<
  CreateConversationParams,
  Conversation
>({
  write: async (params) => {
    await timeout(2000);
    const data = await api
      .post("conversations", {
        json: {
          members: params.members,
        },
      })
      .json<{ data: Conversation }>();

    return data.data;
  },
  key: 'createConversation',
});

export const useCreateConversation = () => {
  const { data: author } = useMe();
  const router = useRouter();
  const temporaryId = useRef<string>("");

  return useOptimisticMutation({
    mutation: createConversation,
    onOptimistic: async (ch, params) => {
      const id = nonce();
      temporaryId.current = id;

      return ch(profileConversationsCollection).prepend(
        {
          _id: id,
          members: params.members,
          hostID: author!.fbId,
        },
        { rollback: false },
      );
    },
    onMutate: () => {
      router.push(`/messages/chat?id=${temporaryId.current}&new=true`);
    },
  });
};
