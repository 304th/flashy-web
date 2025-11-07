import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { profileStreamEntity } from "@/features/profile/entities/profile-stream.entity";

export interface UpdateStreamParams {
  streamId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  scheduledAt?: string;
  chatEnabled?: boolean;
}

const streamUpdateMutation = createMutation<UpdateStreamParams, Stream>({
  write: async (params) => {
    const { streamId, ...updateData } = params;
    return api
      .patch(`streaming/${streamId}`, {
        json: updateData,
      })
      .json<Stream>();
  },
});

export const useUpdateStream = () => {
  return useOptimisticMutation({
    mutation: streamUpdateMutation,
    onOptimistic: async (ch, params) => {
      return ch(profileStreamEntity).update((stream) => {
        if (params.title) stream.title = params.title;
        if (params.description !== undefined) stream.description = params.description;
        if (params.thumbnail) stream.thumbnail = params.thumbnail;
        if (params.scheduledAt !== undefined) stream.scheduledAt = params.scheduledAt;
        if (params.chatEnabled !== undefined) stream.chatEnabled = params.chatEnabled;
      });
    },
    onSuccess: () => {
      toast.success("Stream updated successfully!");
    },
  });
};
