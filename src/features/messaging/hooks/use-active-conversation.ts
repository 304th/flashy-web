import {useMe} from "@/features/auth/queries/use-me";
import { useViewQuery }  from "@/lib/query-toolkit-v2";
import {useQueryParams} from "@/hooks/use-query-params";

export const useActiveConversation = () => {
  const chatId = useQueryParams('id')
  const { data: me } = useMe();

  return useViewQuery<Optimistic<Conversation> | undefined, Conversation[]>({
    queryKey: ["me", me?.fbId, "conversations"],
    select: (conversations) => {
      return conversations.find(conversation => conversation._id === chatId);
    }
  })
}