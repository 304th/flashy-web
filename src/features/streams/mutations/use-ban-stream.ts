import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { streamEntity } from "@/features/streams/entities/stream.entity";

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
      return ch(streamEntity).update((stream) => {
        stream.banned = params.banned;
      });
    },
    onSuccess: (_, __, params) => {
      toast.success(
        params.banned
          ? "Stream banned successfully!"
          : "Stream unbanned successfully!"
      );
    },
  });
};
