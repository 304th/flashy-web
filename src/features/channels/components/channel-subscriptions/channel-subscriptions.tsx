import { Spinner } from "@/components/ui/spinner/spinner";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";
import { useModals } from "@/hooks/use-modals";
import {useChannelFollowings} from "@/features/channels/queries/use-channel-followings";
import {useChannelFollowers} from "@/features/channels/queries/use-channel-followers";

export const ChannelSubscriptions = () => {
  const { channelId, channel, channelQuery } = useChannelContext();
  const { openModal } = useModals();
  const { data: following, query: followingQuery } = useChannelFollowings({ channelId });
  const { data: followers, query: followersQuery } = useChannelFollowers({ channelId });

  return (
    <div className="flex w-full items-center justify-between">
      <div
        className="flex items-center gap-2 h-9 cursor-pointer hover:opacity-80 transition"
        onClick={() =>
          channel?.fbId &&
          openModal("FollowersModal", { channelId: channel.fbId })
        }
      >
        {(channelQuery.isLoading || followingQuery.isLoading) ? (
          <Spinner />
        ) : (
          <>
            <p className="text-2xl font-bold text-white">
              {(following?.length ?? channel?.followersCount ?? 0).toLocaleString()}
            </p>
            <p className="text-white">Followers</p>
          </>
        )}
      </div>
      <div
        className="flex items-center gap-2 h-9 cursor-pointer hover:opacity-80 transition"
        onClick={() =>
          channel?.fbId &&
          openModal("FollowingModal", { channelId: channel.fbId })
        }
      >
        {(channelQuery.isLoading || followingQuery.isLoading) ? (
          <Spinner />
        ) : (
          <>
            <p className="text-2xl font-bold text-white">
              {(followers?.length ?? channel?.followingCount ?? 0).toLocaleString()}
            </p>
            <p className="text-white">Following</p>
          </>
        )}
      </div>
    </div>
  );
};
