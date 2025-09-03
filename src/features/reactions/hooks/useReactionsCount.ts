import { useMemo } from "react";

export const useReactionsCount = (post: Reactable) => {
  return useMemo(
    () =>
      post.reactions
        ? Object.keys(post.reactions).reduce(
          (sum, key) => (sum += Object.keys(post.reactions[key]).length),
          0
        )
        : 0,
    [post]
  )
}