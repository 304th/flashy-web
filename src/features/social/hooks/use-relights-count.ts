import { useMemo } from "react";

export const useRelightsCount = (post: Relightable) =>
  useMemo(() => Object.keys(post?.relits || {}).length, [post]);
