"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface PlaylistContextType {
  playlistId: string | null;
  playlistTitle: string | null;
  autoplay: boolean;
  setPlaylist: (id: string | null, title?: string) => void;
  setAutoplay: (enabled: boolean) => void;
  playNextVideo: (
    currentVideoId: string,
    videos: VideoPost[],
    playlistId?: string,
  ) => void;
  playPreviousVideo: (currentVideoId: string, videos: VideoPost[]) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined,
);

export const usePlaylistContext = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error(
      "usePlaylistContext must be used within a PlaylistProvider",
    );
  }
  return context;
};

interface PlaylistProviderProps {
  children: ReactNode;
}

export const PlaylistProvider = ({ children }: PlaylistProviderProps) => {
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [playlistTitle, setPlaylistTitle] = useState<string | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const router = useRouter();

  const setPlaylist = useCallback((id: string | null, title?: string) => {
    setPlaylistId(id);
    setPlaylistTitle(title || null);
  }, []);

  const playNextVideo = useCallback(
    (currentVideoId: string, videos: VideoPost[], playlistId?: string) => {
      const currentIndex = videos.findIndex(
        (video) => video._id === currentVideoId,
      );
      if (currentIndex !== -1 && currentIndex < videos.length - 1) {
        const nextVideo = videos[currentIndex + 1];
        router.push(`/video/post?id=${nextVideo._id}&playlistId=${playlistId}`);
      }
    },
    [router],
  );

  const playPreviousVideo = useCallback(
    (currentVideoId: string, videos: VideoPost[], playlistId?: string) => {
      const currentIndex = videos.findIndex(
        (video) => video._id === currentVideoId,
      );
      if (currentIndex > 0) {
        const previousVideo = videos[currentIndex - 1];
        router.push(
          `/video/post?id=${previousVideo._id}&playlistId=${playlistId}`,
        );
      }
    },
    [router],
  );

  const value: PlaylistContextType = {
    playlistId,
    playlistTitle,
    autoplay,
    setPlaylist,
    setAutoplay,
    playNextVideo,
    playPreviousVideo,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};
