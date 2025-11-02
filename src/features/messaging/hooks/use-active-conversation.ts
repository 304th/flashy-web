import {useMe} from "@/features/auth/queries/use-me";
import { useViewQuery }  from "@/lib/query-toolkit-v2";

export const useActiveConversation = (chatId?: string) => {
  const { data: me } = useMe();

  return useViewQuery<Conversation | undefined, Conversation[]>({
    queryKey: ["me", me?.fbId, "conversations"],
    select: (conversations) => {
      return conversations.find(conversation => conversation._id === chatId);
    }
  })
}