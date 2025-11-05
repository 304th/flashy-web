import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { profileStreamsCollection } from "@/features/profile/entities/profile-streams.collection";

export interface EndStreamParams {
  streamId: string;
}

const endStreamMutation = createMutation<EndStreamParams, Stream>({
  write: async (params) => {
    return api
      .post(`streaming/${params.streamId}/end`, {})
      .json<Stream>();
  },
});

export const useEndStream = () => {
  return useOptimisticMutation({
    mutation: endStreamMutation,
    onOptimistic: async (ch, params) => {
      return ch(profileStreamsCollection).update(params.streamId, (stream) => {
        stream.status = "ended";
        stream.isLive = false;
        stream.endedAt = new Date().toISOString();
      });
    },
    onSuccess: () => {
      toast.success("Stream ended successfully!");
    },
  });
};
