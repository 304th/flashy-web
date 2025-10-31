import { getQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const useUsersSearchByUsername = (username?: string) => {
  return getQuery(
    ["usersSearch", username],
    async () => {
      return api
        .get("users/search", { searchParams: { username: username! } })
        .json<User[]>();
    },
    Boolean(username),
  );
};
