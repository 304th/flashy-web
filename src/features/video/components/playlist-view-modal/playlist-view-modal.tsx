import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { useVideosInPlaylist } from "@/features/video/queries/use-videos-in-playlist";
import { Loadable } from "@/components/ui/loadable";
import { VideoFeed } from "@/features/video/components/video-feed/video-feed";

export interface PlaylistViewModalProps {
  playlist: Playlist;
  onClose(): void;
}

export const PlaylistViewModal = ({
  playlist,
  onClose,
  ...props
}: PlaylistViewModalProps) => {
  const { data: videos, query } = useVideosInPlaylist(playlist.fbId);

  const stats = useMemo(() => {
    const totalViews = (videos || []).reduce(
      (sum, v) => sum + (v.views || 0),
      0,
    );
    const videosCount = (videos || []).length;

    return { totalViews, videosCount };
  }, [videos]);

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-4 rounded-md"
      >
        <div
          className="relative w-full h-[250px] rounded-t-md overflow-hidden
            bg-center bg-cover"
          style={{ backgroundImage: `url(${playlist.image})` }}
          role="img"
          aria-label="Playlist Cover"
        >
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70
              to-transparent"
          />
          <div className="absolute left-4 bottom-4">
            <p className="text-3xl font-extrabold text-white drop-shadow-md">
              {playlist.title}
            </p>
          </div>
          <div className="absolute right-2 top-2 bg-base-250 rounded-md" onClick={onClose}>
            <CloseButton />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          <div className="flex flex-col gap-1 p-4 rounded-md bg-base-200 border">
            <p className="text-sm text-white/70">Views</p>
            <p className="text-3xl font-semibold text-white">
              {stats.totalViews.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-md bg-base-200 border">
            <p className="text-sm text-white/70">Videos</p>
            <p className="text-3xl font-semibold text-white">
              {stats.videosCount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <Loadable queries={[query as any]} fullScreenForDefaults>
            {() => <VideoFeed query={query} videos={videos as any} />}
          </Loadable>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[600px] !bg-base-300 !rounded-md
      max-sm:w-full shadow-2xl overflow-hidden ${props.className}`}
  />
);
