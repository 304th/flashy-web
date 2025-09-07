import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useSocialPostOwned = (socialPost: SocialPost) => {
  const [me] = useMe();

  return useMemo(() => {
    if (!me) return false;

    return me.fbId === socialPost.userId;
  }, [socialPost, me]);
};
