import Link from "next/link";
import { VideoPostDescription } from "@/features/video/components/video-post/video-post-description";
import { VideoPostDuration } from "@/features/video/components/video-post/video-post-duration";
import { VideoPostMenu } from "@/features/video/components/video-post/video-post-menu";

export const VideoPost = ({
  videoPost,
  isLinkable,
}: {
  videoPost: Optimistic<VideoPost>;
  isLinkable?: boolean;
  className?: string;
}) => {
  return (
    <div
      className="group relative flex flex-col gap-2 w-[320px] items-center
        bg-[linear-gradient(180deg,#151515_0%,#151515_0.01%,#19191920_100%)]"
    >
      <Link
        href={`/video/post?id=${videoPost._id}`}
        className="flex flex-col w-full gap-2 rounded transition
          group-hover:bg-base-200 p-2"
      >
        <div
          className="relative w-full h-[180px] bg-cover bg-center rounded"
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
