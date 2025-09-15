import { useQuerySubset } from "@/lib/query.v3";

export const useCommentsCount = (postId: string) => {
  return useQuerySubset<number, CommentPost[]>({
    existingQueryKey: ["comments", postId],
    selectorFn: (data) => data.length,
    deps: [postId],
  });
};
