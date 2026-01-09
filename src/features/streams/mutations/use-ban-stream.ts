import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { profileStreamsCollection } from "@/features/profile/entities/profile-streams.collection";

export interface BanStreamParams {
  streamId: string;
  banned: boolean;
}

const streamBanMutation = createMutation<BanStreamParams, void>({
  write: async (params) => {
    return api
      .patch(`streaming/${params.streamId}`, {
        json: { banned: params.banned },
      })
      .json<void>();
  },
});

export const useBanStream = () => {
  return useOptimisticMutation({
    mutation: streamBanMutation,
    onOptimistic: async (ch, params) => {
      return ch(profileStreamsCollection).update(params.streamId, {
        banned: params.banned,
      });
    },
    onSuccess: (_, params) => {
      toast.success(
        params.banned
          ? "Stream banned successfully!"
          : "Stream unbanned successfully!"
      );
    },
  });
};
