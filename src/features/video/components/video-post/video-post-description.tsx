import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

export const VideoPostDescription = ({
  videoPost,
}: {
  videoPost: Optimistic<VideoPost>;
}) => {
  return (
    <div className="flex flex-col w-full justify-start px-2">
      <p className="text-lg font-medium text-white">{videoPost.title}</p>
      <p>@{videoPost.username}</p>
      <p>
        <Views views={videoPost.views} />
        <Timestamp createdAt={videoPost.createdAt} />
      </p>
    </div>
  );
};

const Views = ({ views }: { views: VideoPost["views"] }) => {
  if (!views) {
    return null;
  }

  return <span>{views} Views - </span>;
};

const Timestamp = ({ createdAt }: { createdAt: VideoPost["createdAt"] }) => {
  console.log("CREATED_AT: ", createdAt);

  const timeAgo = useMemo(
    () => formatDistanceToNow(new Date(createdAt), { addSuffix: true }),
    [createdAt],
  );

  return <span>{timeAgo}</span>;
};
