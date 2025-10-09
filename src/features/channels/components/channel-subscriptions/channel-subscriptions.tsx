import { Spinner } from "@/components/ui/spinner/spinner";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";

export const ChannelSubscriptions = () => {
  const { channel, channelQuery } = useChannelContext();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2 h-9">
        {channelQuery.isLoading ? (
          <Spinner />
        ) : (
          <>
            <p className="text-2xl font-bold text-white">
              {(channel?.followersCount ?? 0).toLocaleString()}
            </p>
            <p className="text-white">Followers</p>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 h-9">
        {channelQuery.isLoading ? (
          <Spinner />
        ) : (
          <>
            <p className="text-2xl font-bold text-white">
              {(channel?.followingCount ?? 0).toLocaleString()}
            </p>
            <p className="text-white">Following</p>
          </>
        )}
      </div>
    </div>
  );
};
