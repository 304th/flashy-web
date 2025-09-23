import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsSocialPostLocked = (socialPost: SocialPost) => {
  const [me] = useMe();

  return useMemo(
    () =>
      socialPost.behindKey &&
      !socialPost.unlocked &&
      socialPost.userId !== me?.fbId,
    [me, socialPost],
  );
};
