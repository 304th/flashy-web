"use client";

import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { VideoWatch } from "@/features/video/components/video-watch/video-watch";
import { useQueryParams } from "@/hooks/use-query-params";
import { useVideoPostById } from "@/features/video/queries/use-video-post-by-id";

export default function VideoPostPage() {
  const id = useQueryParams("id");
  const { data: videoPost, query } = useVideoPostById(id!);

  if (!id) {
    return <VideoPostNotFound />;
  }

  return (
    <Loadable queries={[query]}>
      {() =>
        videoPost ? (
          <VideoWatch key={videoPost._id} videoPost={videoPost} />
        ) : (
          <VideoPostNotFound />
        )
      }
    </Loadable>
  );
}

const VideoPostNotFound = () => <NotFound>Video does not exist.</NotFound>;
