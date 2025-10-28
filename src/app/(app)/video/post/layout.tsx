'use client';

import { type ReactNode, Suspense } from "react";
import {Loadable} from "@/components/ui/loadable";
import {VideoWatch} from "@/features/video/components/video-watch/video-watch";
import {VideoSidebar} from "@/features/video/components/video-sidebar/video-sidebar";
import {PlaylistProvider} from "@/features/video/components/video-playlist-context";
import {useQueryParams} from "@/hooks/use-query-params";
import {useVideoPostById} from "@/features/video/queries/use-video-post-by-id";

export default function VideoPostLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PlaylistProvider>
      <Suspense>
        <VideoPostLayoutComponent>
          {children}
        </VideoPostLayoutComponent>
      </Suspense>
    </PlaylistProvider>
  );
}

const VideoPostLayoutComponent = ({ children }: { children: ReactNode }) => {
  const id = useQueryParams("id");
  const playlistId = useQueryParams("playlistId");
  const { data: videoPost } = useVideoPostById(id!);

  return (
    <div className="relative flex gap-4 w-full">
      <div className="w-5/7">
        {children}
      </div>
      <div className="w-2/7">
        <VideoSidebar
          playlistId={playlistId || videoPost?.playlist?.fbId}
          playlistTitle={videoPost?.playlist?.title}
        />
      </div>
    </div>
  )
}