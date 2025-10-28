"use client";

import { Loadable } from "@/components/ui/loadable";
import { useTopVideos } from "@/features/video/queries/use-top-videos";
import { NotFound } from "@/components/ui/not-found";
import { VideoPost } from "@/features/video/components/video-post/video-post";

export const RecentVideos = () => {
  const { data: topVideos, query } = useTopVideos();

  return (
    <div className="flex flex-col gap-3">
      <Loadable queries={[query as any]} fullScreenForDefaults>
        {() => (
          <div className="flex flex-col gap-3">
            <p className="text-white text-lg font-medium">Recent videos</p>
            {!topVideos?.length ? (
              <NotFound>No recent videos</NotFound>
            ) : (
              <div className="flex flex-col gap-2">
                {topVideos.map((video) => (
                  <VideoPost key={video.fbId} videoPost={video} horizontal />
                ))}
              </div>
            )}
          </div>
        )}
      </Loadable>
    </div>
  );
};
