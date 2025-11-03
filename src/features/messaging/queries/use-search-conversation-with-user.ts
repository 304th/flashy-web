import { getQuery } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { api } from "@/services/api";

export const useSearchConversationWithUser = (userId?: string) => {
  const { data: me } = useMe();

  return getQuery<Conversation>(
    ["conversation", "search", me?.fbId, userId],
    async () => {
      const response = await api
        .get("conversations/search", {
          searchParams: {
            withMember: userId!,
          },
        })
        .json<{ data: Conversation }>();

      return response.data;
    },
    Boolean(me && userId),
  );
};
