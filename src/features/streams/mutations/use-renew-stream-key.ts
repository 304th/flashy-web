import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { profileStreamEntity} from "@/features/profile/entities/profile-stream.entity";

export interface RenewStreamKeyParams {
  streamId: string;
}

const renewStreamKeyMutation = createMutation<RenewStreamKeyParams, Stream>({
  write: async (params) => {
    return api
      .post(`streaming/${params.streamId}/renew-key`, {})
      .json<Stream>();
  },
});

export const useRenewStreamKey = () => {
  return useOptimisticMutation({
    mutation: renewStreamKeyMutation,
    onSuccess: (newStream, channel) => {
      toast.success("Stream key renewed successfully!");
      // Update the stream with the new data from server
      void channel(profileStreamEntity).update((stream) => {
        if (newStream.streamKey) stream.streamKey = newStream.streamKey;
        if (newStream.rtmpUrl) stream.rtmpUrl = newStream.rtmpUrl;
      });
    },
    onError: (error) => {
      toast.error("Failed to renew stream key");
      console.error("Renew stream key error:", error);
    },
  });
};
