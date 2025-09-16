import { getQuery } from "@/lib/query-toolkit";
import { api } from "@/services/api";

export const useSocialPostLinks = (id: string) =>
  getQuery(["social", id, "links"], async () => {
    return api.get(`social-posts-links/${id}`).json();
  });
