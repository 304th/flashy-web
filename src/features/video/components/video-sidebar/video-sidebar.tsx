"use client";

import { Loadable } from "@/components/ui/loadable";
import { useTopVideos } from "@/features/video/queries/use-top-videos";
import { NotFound } from "@/components/ui/not-found";
import { VideoPost } from "@/features/video/components/video-post/video-post";

export const VideoSidebar = () => {
  const { data: topVideos, query } = useTopVideos();

  return (
    <div className="sticky top-4 flex flex-col gap-3">
      <p className="text-white font-medium text-lg">Recent</p>
      <Loadable queries={[query as any]} fullScreenForDefaults>
        {() =>
          !topVideos?.length ? (
            <NotFound>No recent videos</NotFound>
          ) : (
            topVideos.map((video) => (
              <VideoPost key={video.fbId} videoPost={video} horizontal />
            ))
          )
        }
      </Loadable>
    </div>
  );
};
