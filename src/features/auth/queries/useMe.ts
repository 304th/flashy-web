import { api } from "@/services/api";
import { getQuery } from "@/lib/query";

export const transformLegacyMe = (serverUser: LegacyMe): Me => {
  return {
    id: serverUser.fbId,
    name: serverUser.username,
    avatar: serverUser.userimage,
  };
};

export const useMe = () =>
  getQuery<Me>(["me"], async () =>
    transformLegacyMe(await api.get("loginConfirm").json<LegacyMe>()),
  );
