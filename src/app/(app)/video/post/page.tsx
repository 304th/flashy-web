"use client";

import { Suspense } from "react";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { VideoWatch } from "@/features/video/components/video-watch/video-watch";
import { VideoSidebar } from "@/features/video/components/video-sidebar/video-sidebar";
import { PlaylistProvider } from "@/features/video/components/video-playlist-context";
import { useQueryParams } from "@/hooks/use-query-params";
import { useVideoPostById } from "@/features/video/queries/use-video-post-by-id";

export default function VideoPostPage() {
  return (
    <PlaylistProvider>
      <Suspense>
        <VideoPostByIdPage />
      </Suspense>
    </PlaylistProvider>
  );
}

const VideoPostByIdPage = () => {
  const id = useQueryParams("id");
  const { data: videoPost, query } = useVideoPostById(id!);

  if (!id) {
    return <VideoPostNotFound />;
  }

  return (
    <div className="relative flex gap-4 w-full">
      <div className="w-5/7">
        <Loadable queries={[query]}>
          {() =>
            videoPost ? (
              <VideoWatch videoPost={videoPost} />
            ) : (
              <VideoPostNotFound />
            )
          }
        </Loadable>
      </div>
      <div className="w-2/7">
        <VideoSidebar 
          playlistId={videoPost?.playlist?.fbId}
          playlistTitle={videoPost?.playlist?.title}
        />
      </div>
    </div>
  );
};

const VideoPostNotFound = () => <NotFound>Video does not exist.</NotFound>;
