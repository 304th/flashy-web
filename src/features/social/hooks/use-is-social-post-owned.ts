import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsSocialPostOwned = (socialPost: SocialPost) => {
  const { data: me, query } = useMe();

  return useMemo(() => {
    if (!me) return false;

    return me.fbId === socialPost.userId;
  }, [socialPost, me]);
};
