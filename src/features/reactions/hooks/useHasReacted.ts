import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/useMe";

export const useHasReacted = (post: Reactable) => {
  const [me] = useMe();

  return useMemo(() => {
    if (!me || !post.reactions) {
      return false;
    }

    return Boolean(
      Object.keys(post.reactions)?.find?.((key) =>
        Boolean(post.reactions?.[key]?.[me.fbId]),
      ),
    );
  }, [post, me]);
};
