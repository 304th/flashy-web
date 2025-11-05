import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { profileStreamsCollection } from "@/features/profile/entities/profile-streams.collection";

export interface DeleteStreamParams {
  streamId: string;
}

const streamDeleteMutation = createMutation<DeleteStreamParams, void>({
  write: async (params) => {
    return api.delete(`streaming/${params.streamId}`).json<void>();
  },
});

export const useDeleteStream = () => {
  return useOptimisticMutation({
    mutation: streamDeleteMutation,
    onOptimistic: async (ch, params) => {
      return ch(profileStreamsCollection).delete(params.streamId);
    },
    onSuccess: () => {
      toast.success("Stream deleted successfully!");
    },
  });
};
