import { getLocalStorageQuery } from "@/lib/query-toolkit-v2";

export const useNewConversationUser = () =>
  getLocalStorageQuery<Author>(["conversation", "new", "user"]);
