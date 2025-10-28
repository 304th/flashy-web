import { timeAgo } from "@/lib/utils";
import { PlaylistMenu } from "@/features/video/components/playlist/playlist-menu";

export const Playlist = ({ playlist }: { playlist: Playlist }) => {
  return (
    <div
      className="relative flex items-center gap-6 rounded bg-base-200 h-[150px]
        max-w-[690px] w-full overflow-hidden cursor-pointer transition
        hover:bg-base-300"
    >
      <div
        className={"relative w-1/3 h-full aspect-video bg-cover bg-center"}
        style={{ backgroundImage: `url(${playlist.image})` }}
        role="img"
        aria-label="Video Post Thumbnail"
      />
      <div className="flex flex-col justify-start">
        <p className="text-white text-lg font-medium">{playlist.title}</p>
        <p>{playlist.description}</p>
      </div>
      <div className="absolute top-4 right-4 flex gap-2 items-center">
        {/*<p>{timeAgo(playlist.createdAt)}</p>*/}
        <PlaylistMenu playlist={playlist} />
      </div>
    </div>
  );
};
