import { toast } from "sonner";
import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { profileStreamsCollection } from "@/features/profile/entities/profile-streams.collection";

export interface CreateStreamParams {
  title: string;
  description: string;
  thumbnail?: string;
  scheduledAt?: string;
  chatEnabled: boolean;
}

export interface CreateStreamResponse extends Stream {
  streamKey: string;
  rtmpUrl: string;
}

const streamCreateMutation = createMutation<
  CreateStreamParams,
  CreateStreamResponse
>({
  write: async (params) => {
    return api
      .post("streaming/create", {
        json: params,
      })
      .json<CreateStreamResponse>();
  },
});

export const useCreateStream = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: streamCreateMutation,
    onOptimistic: async (ch, params) => {
      const optimisticStream = {
        ...params,
        userId: author!.fbId,
        author: {
          fbId: author!.fbId,
          username: author!.username,
          userimage: author!.userimage,
        },
        status: params.scheduledAt ? ("scheduled" as const) : ("upcoming" as const),
        isLive: false,
        viewerCount: 0,
        externalStreamId: "",
        thumbnail: params.thumbnail || "",
      };

      return ch(profileStreamsCollection).prepend(optimisticStream, {
        sync: true,
      });
    },
    onSuccess: () => {
      toast.success("Stream created successfully!");
    },
  });
};
