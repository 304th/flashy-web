import { useViewQuery } from "@/lib/query-toolkit-v2";

export const useCommentsCount = (postId: string) => {
  return useViewQuery<number, CommentPost[]>({
    queryKey: ["comments", postId],
    select: (data) => data.length,
  });
};
