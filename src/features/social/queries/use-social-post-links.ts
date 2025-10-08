import { getQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const useSocialPostLinks = (id: string) =>
  getQuery(["social", id, "links"], async () => {
    return api.get(`social-posts-links/${id}`).json();
  });
