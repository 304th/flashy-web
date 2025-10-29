import Link from "next/link";
import { VideoPostDescription } from "@/features/video/components/video-post/video-post-description";
import { VideoPostDuration } from "@/features/video/components/video-post/video-post-duration";
import { VideoPostMenu } from "@/features/video/components/video-post/video-post-menu";

export const VideoPost = ({
  videoPost,
  horizontal,
  className,
  includePlaylist,
}: {
  videoPost: Optimistic<VideoPost>;
  horizontal?: boolean;
  className?: string;
  includePlaylist?: string;
}) => {
  return (
    <div
      className={`group relative flex flex-col gap-2 w-full items-center
        bg-[linear-gradient(180deg,#151515_0%,#151515_0.01%,#33333320_100%)]
        ${className} rounded`}
    >
      <Link
        href={`/video/post?id=${videoPost._id}${includePlaylist ? `&playlistId=${includePlaylist}` : ""}`}
        className={`flex flex-col w-full gap-2 rounded-md transition
          group-hover:bg-base-300 p-2 ${horizontal ? "flex-row" : ""}`}
      >
        <div
          className={`relative w-full h-[180px] bg-cover bg-center rounded
            ${horizontal ? "h-[110px]!" : ""}`}
          style={{ backgroundImage: `url(${videoPost.storyImage})` }}
          role="img"
          aria-label="Video Post Thumbnail"
        >
          <VideoPostDuration videoPost={videoPost} />
        </div>
        <VideoPostDescription videoPost={videoPost} />
      </Link>
      <div className="absolute top-3 right-3">
        <VideoPostMenu videoPost={videoPost} />
      </div>
    </div>
  );
};
