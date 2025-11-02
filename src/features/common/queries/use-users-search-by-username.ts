import { getQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";

export const useUsersSearchByUsername = (
  username?: string,
  options: { hideMyself: boolean } = { hideMyself: false },
) => {
  const { data: me } = useMe();

  return getQuery(
    ["usersSearch", username],
    async () => {
      return api
        .get("users/search", { searchParams: { username: username! } })
        .json<User[]>();
    },
    Boolean(username),
    {
      select: (foundUsers: TODO) => {
        return options.hideMyself
          ? foundUsers.filter((foundUser: TODO) => foundUser.fbId !== me?.fbId)
          : foundUsers;
      },
    },
  );
};
