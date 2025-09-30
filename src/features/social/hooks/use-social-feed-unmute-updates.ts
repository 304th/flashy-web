import { useMe } from "@/features/auth/queries/use-me";
import type { MuteChannelParams } from "@/features/channels/mutations/use-mute-channel";

export const useSocialFeedUnmuteUpdates = () => {
  const { optimisticUpdates: me } = useMe();

  return [
    async (params: MuteChannelParams) => {
      return await me.update((meUser) => {
        const foundIndex = meUser?.mutedUsers?.findIndex?.(
          (id) => id === params.userId,
        );

        if (typeof foundIndex === "number" && foundIndex !== -1) {
          meUser.mutedUsers?.splice?.(foundIndex, 1);
        }
      });
    },
  ];
};
