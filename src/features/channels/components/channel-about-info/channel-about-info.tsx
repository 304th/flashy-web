export const ChannelAboutInfo = ({ channel }: { channel: User }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-lg whitespace-pre-wrap text-wrap">
        {channel.bio || "No bio yet"}
      </p>
      {channel?.links && Object.keys(channel?.links).length > 0 && (
        <div className="flex flex-col">
          {Object.entries(channel?.links || {})?.map?.(([key, value]) => (
            <a
              key={key}
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-lg text-orange-400 underline"
            >
              {key}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
