"use client";

import { Loadable } from "@/components/ui/loadable";
import { useVideosInPlaylist } from "@/features/video/queries/use-videos-in-playlist";
import { NotFound } from "@/components/ui/not-found";
import { VideoPost } from "@/features/video/components/video-post/video-post";
import { Switch } from "@/components/ui/switch";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePlaylistContext } from "@/features/video/components/video-playlist-context";

interface VideoPlaylistProps {
  playlistId: string;
  playlistTitle?: string;
  onClose?: () => void;
}

export const VideoPlaylist = ({ playlistId, playlistTitle, onClose }: VideoPlaylistProps) => {
  const { data: playlistVideos, query } = useVideosInPlaylist(playlistId);
  const { autoplay, setAutoplay } = usePlaylistContext();
  const currentVideoId = useQueryParams("id");

  return (
    <div className="flex flex-col gap-3 border p-2 rounded-md overflow-y-scroll max-h-[700px]">
      <div className="flex items-center justify-between px-2 pb-2 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-medium text-lg">{playlistTitle || "Playlist"}</h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-base-300"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Autoplay:</span>
          <Switch.Root
            checked={autoplay}
            onCheckedChange={setAutoplay}
          />
        </div>
      </div>
      <Loadable queries={[query as any]} fullScreenForDefaults>
        {() =>
          !playlistVideos?.length ? (
            <NotFound>No videos in playlist</NotFound>
          ) : (
            <div className="flex flex-col gap-2">
              {playlistVideos.map((video, index) => (
                <div
                  key={video.fbId}
                  className={`relative ${
                    video._id === currentVideoId 
                      ? ' bg-base-300' 
                      : ''
                  } rounded-md transition-all`}
                >
                  <VideoPost 
                    videoPost={video} 
                    horizontal 
                    className={video._id === currentVideoId ? 'opacity-100' : 'opacity-90 hover:opacity-100'}
                  />
                  <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </Loadable>
    </div>
  );
};
