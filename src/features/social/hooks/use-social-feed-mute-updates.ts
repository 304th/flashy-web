import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import { useMe } from "@/features/auth/queries/use-me";
import type { MuteChannelParams } from "@/features/channels/mutations/use-mute-channel";

export const useSocialFeedMuteUpdates = () => {
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return [
    async (params: MuteChannelParams) => {
      return await socialFeed.filter((post) => post.userId !== params.userId);
    },
  ];
};
