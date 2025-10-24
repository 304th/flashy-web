import { useMemo } from "react";
import { formatVideoDuration } from "@/features/video/utils/format-video-duration";

export const VideoPostDuration = ({
  videoPost,
}: {
  videoPost: Optimistic<VideoPost>;
}) => {
  const formattedDuration = useMemo(
    () => formatVideoDuration(videoPost.videoDuration),
    [videoPost.videoDuration],
  );

  return (
    <div
      className="absolute bottom-1 right-1 bg-[#111111dd] px-3 py-1 rounded-xl"
    >
      <p className="text-white text-sm">{formattedDuration}</p>
    </div>
  );
};
