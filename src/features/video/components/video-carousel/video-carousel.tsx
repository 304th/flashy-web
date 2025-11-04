import Link from "next/link";
import { VideoPost } from "@/features/video/components/video-post/video-post";

export const VideoCarousel = ({
  title,
  videoPosts,
}: {
  title: string;
  videoPosts: VideoPost[];
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <p className="text-white text-lg font-medium">{title}</p>
        <Link
          href="/video"
          className="text-brand-200 transition hover:bg-brand-100/10 py-[2px]
            px-2 rounded-md"
        >
          More Videos
        </Link>
      </div>
      <div className="flex items-center gap-4 w-full overflow-x-auto">
        {videoPosts.map((videoPost) => (
          <VideoPost
            key={videoPost._id}
            videoPost={videoPost}
            className="max-w-[300px]"
          />
        ))}
      </div>
    </div>
  );
};
