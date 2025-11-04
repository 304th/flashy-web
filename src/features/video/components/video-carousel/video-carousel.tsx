import Link from "next/link";
import { VideoPost } from "@/features/video/components/video-post/video-post";
import { NotFound } from "@/components/ui/not-found";
import { Loadable } from "@/components/ui/loadable";

export const VideoCarousel = ({
  title,
  query,
}: {
  title: string;
  query: TODO;
}) => {
  const { data: videos } = query;

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
        <Loadable queries={[query]} fullScreenForDefaults fallback={<Fallback />}>
          {() => videos && videos?.length > 0 ? videos.map((videoPost: TODO) => (
              <VideoPost
                key={videoPost._id}
                videoPost={videoPost}
                className="max-w-[300px]"
              />
            )): <div className="flex w-full justify-center items-center"><NotFound>Videos not found</NotFound></div>
          }
        </Loadable>
      </div>
    </div>
  );
};

const Fallback = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full h-[272px]">
    <div className="skeleton flex rounded"/>
    <div className="skeleton flex rounded"/>
    <div className="skeleton flex rounded"/>
    <div className="skeleton flex rounded"/>
  </div>
)
