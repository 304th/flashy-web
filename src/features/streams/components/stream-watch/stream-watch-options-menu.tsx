import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MeatballIcon } from "@/components/ui/icons/meatball";
import { useModals } from "@/hooks/use-modals";
import { useMe } from "@/features/auth/queries/use-me";
import { useIsChannelMuted } from "@/features/auth/hooks/use-is-channel-muted";
import { useMuteChannel } from "@/features/channels/mutations/use-mute-channel";
import { useUnmuteChannel } from "@/features/channels/mutations/use-unmute-channel";
import { useIsStreamOwned } from "@/features/streams/hooks/use-is-stream-owned";

export const StreamWatchMenu = ({
  stream,
  size = "sm",
}: {
  stream: Stream;
  size?: "sm" | "default" | "xs" | "lg" | "xl" | "icon";
}) => {
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const muteUser = useMuteChannel();
  const unmuteUser = useUnmuteChannel();
  const isOwned = useIsStreamOwned(stream);
  const hasMuted = useIsChannelMuted(stream.userId);

  if (!me) {
    return null;
  }

  return (
    <div className="relative flex" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[50px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild className="relative z-1">
          <Button
            className="!w-fit p-0 aspect-square"
            variant="secondary"
            size={size}
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <MeatballIcon />
          </Button>
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
                  openModal("GoLiveModal");
                }}
              >
                Edit
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
                            userId: stream.userId,
                          });
                        } else {
                          muteUser.mutate({
                            userId: stream.userId,
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
