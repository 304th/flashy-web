import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import { Loadable } from "@/components/ui/loadable";
import { useProfileVideoFeedPublished } from "@/features/profile/queries/use-profile-video-feed-published";
import { useVideosInPlaylist } from "@/features/video/queries/use-videos-in-playlist";
import { useUpdatePlaylistVideos } from "@/features/video/mutations/use-update-playlist-videos";

export interface PlaylistUpdateVideosModalProps {
  playlist: Playlist;
  onClose(): void;
}

export const PlaylistUpdateVideosModal = ({
  playlist,
  onClose,
  ...props
}: PlaylistUpdateVideosModalProps) => {
  const { data: publishedVideos, query: publishedQuery } =
    useProfileVideoFeedPublished(true);
  const { data: currentPlaylistVideos } = useVideosInPlaylist(playlist.fbId);
  const [selection, setSelection] = useState<string[]>([]);

  useEffect(() => {
    if (currentPlaylistVideos && currentPlaylistVideos.length > 0) {
      setSelection(currentPlaylistVideos.map((v) => v.fbId));
    }
  }, [currentPlaylistVideos]);

  const videosMap = useMemo(() => {
    const map = new Map<string, VideoPost>();
    (publishedVideos || []).forEach((v) => map.set(v.fbId, v));
    return map;
  }, [publishedVideos]);

  const orderedSelection = useMemo(
    () => selection.map((id) => videosMap.get(id)).filter(Boolean) as VideoPost[],
    [selection, videosMap],
  );

  const updateVideosInPlaylist = useUpdatePlaylistVideos();

  const toggle = (id: string) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const move = (id: string, dir: -1 | 1) => {
    setSelection((prev) => {
      const idx = prev.indexOf(id);

      if (idx === -1) {
        return prev;
      }

      const nextIdx = idx + dir;

      if (nextIdx < 0 || nextIdx >= prev.length) {
        return prev;
      }

      const copy = prev.slice();
      const [item] = copy.splice(idx, 1);
      copy.splice(nextIdx, 0, item);

      return copy;
    });
  };

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-4 rounded-md"
      >
        <div className="relative w-full h-[70px] rounded-t-md overflow-hidden bg-base-200">
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <p className="text-xl text-white font-semibold">Update playlist videos</p>
            <div className="bg-base-250 rounded-md" onClick={onClose}>
              <CloseButton />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white/70">Your published videos</p>
            <Loadable queries={[publishedQuery as any]}>
              {() => (
                <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-scroll h-[350px] pr-1">
                  {(publishedVideos || [])
                    .filter((v) => Boolean(v.publishDate))
                    .map((v) => (
                      <div
                        key={v.fbId}
                        className="flex items-center gap-3 p-2 rounded bg-base-200 border"
                      >
                        <div
                          className="w-[72px] h-[48px] rounded bg-cover bg-center"
                          style={{ backgroundImage: `url(${v.storyImage})` }}
                        />
                        <div className="flex flex-col min-w-0 grow">
                          <p className="truncate text-white">{v.title}</p>
                          <p className="text-xs opacity-70">@{v.username}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={selection.includes(v.fbId) ? "destructive" : "secondary"}
                          onClick={() => toggle(v.fbId)}
                        >
                          {selection.includes(v.fbId) ? "Remove" : "Add"}
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </Loadable>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white/70">Videos in playlist</p>
            <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-scroll h-[350px] pr-1">
              {orderedSelection.map((v) => (
                <div
                  key={v._id}
                  className="flex items-center gap-3 p-2 rounded bg-base-200 border"
                >
                  <div
                    className="w-[72px] h-[48px] rounded bg-cover bg-center"
                    style={{ backgroundImage: `url(${v.storyImage})` }}
                  />
                  <div className="flex flex-col min-w-0 grow">
                    <p className="truncate text-white">{v.title}</p>
                    <p className="text-xs opacity-70">@{v.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="secondary" onClick={() => move(v.fbId, -1)}>
                      ↑
                    </Button>
                    <Button size="icon" variant="secondary" onClick={() => move(v.fbId, 1)}>
                      ↓
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => toggle(v.fbId)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateVideosInPlaylist.mutate({ playlistId: playlist.fbId, videoIds: selection });
              onClose();
            }}
          >
            Save
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset min-w-[800px] !bg-base-300 !rounded-md
      max-sm:w-full shadow-2xl overflow-hidden ${props.className}`}
  />
);


