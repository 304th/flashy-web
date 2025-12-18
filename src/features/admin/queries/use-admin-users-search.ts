import { getQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const useAdminUsersSearch = (search?: string) => {
  return getQuery(
    ["adminUsersSearch", search],
    async () => {
      return api
        .get("admin/users/search", { searchParams: { search: search! } })
        .json<User[]>();
    },
    Boolean(search && search.length >= 2),
    {
      staleTime: 30 * 1000,
    },
  );
};
