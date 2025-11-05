import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

export const StreamCardDescription = ({
  stream,
  className,
}: {
  stream: Optimistic<Stream>;
  className?: string;
}) => {
  return (
    <div className="flex flex-col w-full justify-start px-2">
      <p className={`text-lg font-medium text-white ellipsis ${className}`}>
        {stream.title}
      </p>
      <p className="text-sm">@{stream.author.username}</p>
      <p className="text-sm">
        <StreamViewers stream={stream} /> -
        <StreamTimestamp stream={stream} />
      </p>
    </div>
  );
};

export const StreamViewers = ({ stream }: { stream: Stream }) => {
  if (!stream.isLive) {
    return null;
  }
  return <span>{stream.viewerCount || 0} watching</span>;
};

export const StreamTimestamp = ({ stream }: { stream: Stream }) => {
  const timeAgo = useMemo(() => {
    const date = stream.scheduledAt || stream.createdAt;
    return formatDistanceToNow(new Date(date), { addSuffix: true }).replace(
      "about",
      "",
    );
  }, [stream.scheduledAt, stream.createdAt]);

  return <span>{timeAgo}</span>;
};
