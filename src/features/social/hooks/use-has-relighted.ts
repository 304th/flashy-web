import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useHasRelighted = (post: Relightable) => {
  const [me] = useMe();

  return useMemo(() => (me ? post?.relits?.[me.fbId] : false), [post, me]);
};
