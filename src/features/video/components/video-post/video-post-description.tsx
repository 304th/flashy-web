import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

export const VideoPostDescription = ({
  videoPost,
  className,
}: {
  videoPost: Optimistic<VideoPost>;
  className?: string;
}) => {
  return (
    <div className="flex flex-col w-full justify-start px-2">
      <p className={`text-lg font-medium text-white break-words ${className}`}>
        {videoPost.title}
      </p>
      <p className="text-sm">@{videoPost.username}</p>
      <p className="text-sm">
        <VideoViews views={videoPost.views} /> -
        <VideoTimestamp createdAt={videoPost.createdAt} />
      </p>
    </div>
  );
};

export const VideoViews = ({ views }: { views: VideoPost["views"] }) => {
  return <span>{views || 0} Views</span>;
};

export const VideoTimestamp = ({
  createdAt,
}: {
  createdAt: VideoPost["createdAt"];
}) => {
  const timeAgo = useMemo(
    () =>
      formatDistanceToNow(new Date(createdAt), { addSuffix: true }).replace(
        "about",
        "",
      ),
    [createdAt],
  );

  return <span>{timeAgo}</span>;
};
