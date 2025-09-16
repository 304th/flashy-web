import { api } from "@/services/api";
import { createMutation } from "@/lib/query-toolkit/mutation";
import {
  type OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";

export interface DeleteCommentParams {
  id: string;
}

const deleteComment = createMutation({
  writeToSource: async (params: DeleteCommentParams) => {
    return api
      .delete("comment", {
        json: {
          _id: params.id,
        },
      })
      .json();
  },
});

export const useDeleteComment = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<DeleteCommentParams>[];
}) => {
  return useOptimisticMutation({
    mutation: deleteComment,
    optimisticUpdates,
  });
};
