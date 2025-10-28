import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { MeatballIcon } from "@/components/ui/icons/meatball";
import { useModals } from "@/hooks/use-modals";
import { useMe } from "@/features/auth/queries/use-me";
import { useIsPlaylistOwned } from "@/features/video/hooks/use-is-playlist-owned";
import { useDeletePlaylist } from "@/features/video/mutations/use-delete-playlist";
import { useMuteChannel } from "@/features/channels/mutations/use-mute-channel";
import { useUnmuteChannel } from "@/features/channels/mutations/use-unmute-channel";
import { useIsChannelMuted } from "@/features/auth/hooks/use-is-channel-muted";

export const PlaylistMenu = ({ playlist }: { playlist: Playlist }) => {
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const deletePlaylist = useDeletePlaylist();
  const isOwned = useIsPlaylistOwned(playlist);
  const muteUser = useMuteChannel();
  const unmuteUser = useUnmuteChannel();
  const hasMuted = useIsChannelMuted(playlist.hostID);

  if (!me) {
    return null;
  }

  return (
    <div className="relative flex" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[50px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild className="relative z-1">
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            className="relative z-1"
          >
            <MeatballIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="flex flex-col bg-base-300 border-base-400 p-1 gap-1"
          align="end"
        >
          {isOwned && (
            <DropdownMenuGroup className="flex flex-col gap-[2px]">
              <DropdownMenuItem
                onClick={(e) => {
                  setOpen(false);
                  e.preventDefault();
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  setOpen(false);
                  e.preventDefault();
                  openModal("ConfirmModal", {
                    title: "Delete playlist",
                    description:
                      "Are you sure you want to delete this playlist?",
                    destructive: true,
                    onConfirm: () => {
                      deletePlaylist.mutate({
                        id: playlist.fbId,
                      });
                    },
                  });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          {!isOwned && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    setOpen(false);
                    e.preventDefault();
                    openModal("ConfirmModal", {
                      title: hasMuted ? "Unmute" : "Mute",
                      destructive: !hasMuted,
                      description: `Are you sure you want to ${hasMuted ? "unmute" : "mute"} this channel?`,
                      actionTitle: hasMuted ? "Unmute" : "Mute",
                      onConfirm: () => {
                        if (hasMuted) {
                          unmuteUser.mutate({
                            userId: playlist.hostID,
                          });
                        } else {
                          muteUser.mutate({
                            userId: playlist.hostID,
                          });
                        }
                      },
                    });
                  }}
                >
                  {hasMuted ? "Unmute" : "Mute"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
