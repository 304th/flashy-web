"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

interface PlaylistExampleProps {
  playlistId: string;
  playlistTitle: string;
  firstVideoId: string;
}

/**
 * Example component showing how to navigate to a video with playlist context
 * This would typically be used in playlist cards or playlist view modals
 */
export const PlaylistExample = ({ playlistId, playlistTitle, firstVideoId }: PlaylistExampleProps) => {
  const router = useRouter();

  const playPlaylist = () => {
    // Navigate to the first video with playlist context
    router.push(`/video/post?id=${firstVideoId}&playlist=${playlistId}&playlistTitle=${encodeURIComponent(playlistTitle)}`);
  };

  return (
    <Button onClick={playPlaylist} className="flex items-center gap-2">
      <PlayIcon className="w-4 h-4" />
      Play Playlist
    </Button>
  );
};
