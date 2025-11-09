import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { profileStreamsCollection } from "@/features/profile/entities/profile-streams.collection";

export interface GoLiveParams {
  streamId: string;
}

const goLiveMutation = createMutation<GoLiveParams, Stream>({
  write: async (params) => {
    return api.post(`streaming/${params.streamId}/go-live`, {}).json<Stream>();
  },
});

export const useGoLive = () => {
  return useOptimisticMutation({
    mutation: goLiveMutation,
    onOptimistic: async (ch, params) => {
      return ch(profileStreamsCollection).update(params.streamId, (stream) => {
        stream.status = "live";
        stream.isLive = true;
        stream.startedAt = new Date().toISOString();
      });
    },
    onSuccess: () => {
      toast.success("You're now live!");
    },
  });
};
