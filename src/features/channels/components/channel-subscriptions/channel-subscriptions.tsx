export const ChannelSubscriptions = ({ channel }: { channel?: User }) => {
  if (!channel) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-white">
          {(channel.followersCount ?? 0).toLocaleString()}
        </p>
        <p className="text-white">Followers</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-white">
          {(channel.followingCount ?? 0).toLocaleString()}
        </p>
        <p className="text-white">Following</p>
      </div>
    </div>
  );
};
