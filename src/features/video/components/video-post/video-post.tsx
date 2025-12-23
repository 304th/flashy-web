import Link from "next/link";
import { VideoPostDescription } from "@/features/video/components/video-post/video-post-description";
import { VideoPostDuration } from "@/features/video/components/video-post/video-post-duration";
import { VideoPostMenu } from "@/features/video/components/video-post/video-post-menu";
import Image from "next/image";

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
        ${className} rounded`}
    >
      <Link
        href={`/video/post?id=${videoPost._id}${includePlaylist ? `&playlistId=${includePlaylist}` : ""}`}
        className={`flex flex-col w-full gap-2 rounded-md transition
          group-hover:bg-base-300 p-2 ${horizontal ? "flex-row" : ""}`}
      >
        <div
          className={`relative w-full h-[180px] shrink-0 bg-cover bg-center
            rounded overflow-hidden
            ${horizontal ? "h-[110px]! !shrink-0 !w-fit aspect-video" : ""}`}
        >
          <Image
            src={videoPost.storyImage}
            alt="Video Thumbnail"
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <VideoPostDuration videoPost={videoPost} />
        </div>
        <VideoPostDescription
          videoPost={videoPost}
          className={horizontal ? "max-w-[67%] text-[14px]" : "w-full"}
        />
      </Link>
      <div className="absolute top-3 right-3">
        <VideoPostMenu videoPost={videoPost} />
      </div>
    </div>
  );
};
