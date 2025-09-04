import { api } from "@/services/api";
import { getQuery } from "@/lib/query";

export const useReplies = (id: string) =>
  getQuery(["replies", id], async () => {
    return await api.get(`commentReplies/${id}`).json<Reply[]>();
  });
