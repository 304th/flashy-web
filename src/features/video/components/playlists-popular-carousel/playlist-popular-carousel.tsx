import {usePopularPlaylists} from "@/features/video/queries/use-popular-playlists";

export const PlaylistPopularCarousel = () => {
  const { data: popularPlaylists, query } = usePopularPlaylists();

  return null;
}