"use client";

import { RecentVideos } from "./recent-videos";
import { VideoPlaylist } from "./video-playlist";

interface VideoSidebarProps {
  playlistId?: string;
  playlistTitle?: string;
  onClose?: () => void;
}

export const VideoSidebar = ({
  playlistId,
  playlistTitle,
  onClose,
}: VideoSidebarProps) => {
  return (
    <div className="sticky top-4 flex flex-col gap-6">
      {playlistId ? (
        <VideoPlaylist
          playlistId={playlistId}
          playlistTitle={playlistTitle}
          onClose={onClose}
        />
      ) : null}
      <RecentVideos />
    </div>
  );
};
