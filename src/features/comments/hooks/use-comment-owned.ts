import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useCommentOwned = (comment: CommentPost | Reply) => {
  const [me] = useMe();

  return useMemo(() => {
    if (!me) return false;

    return me.fbId === comment.created_by._id;
  }, [comment, me]);
};
