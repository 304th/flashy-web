import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { useModals } from "@/hooks/use-modals";
import { Button } from "@/components/ui/button";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";
import { useIsChannelMuted } from "@/features/auth/hooks/use-is-channel-muted";
import { useMuteChannel } from "@/features/channels/mutations/use-mute-channel";
import { useUnmuteChannel } from "@/features/channels/mutations/use-unmute-channel";
import { useIsSubscribed } from "@/features/auth/hooks/use-is-subscribed";
import { useUnsubscribeFromChannel } from "@/features/channels/mutations/use-unsubscribe-from-channel";

export const ChannelMenu = () => {
  const { channelId } = useChannelContext();
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const hasMuted = useIsChannelMuted(channelId);
  const [isSubscribed] = useIsSubscribed(channelId);
  const muteUser = useMuteChannel();
  const unmuteUser = useUnmuteChannel();
  const unsubscribe = useUnsubscribeFromChannel();

  return (
    <div className="relative flex" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[50px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild className="relative z-1">
          <Button
            variant="secondary"
            className="aspect-square !w-fit p-0"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="flex flex-col bg-base-300 border-base-400 p-1 gap-1"
          align="end"
        >
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              openModal("ConfirmModal", {
                title: hasMuted ? "Unmute" : "Mute",
                destructive: !hasMuted,
                description: `Are you sure you want to ${hasMuted ? "unmute" : "mute"} this channel?`,
                actionTitle: hasMuted ? "Unmute" : "Mute",
                onConfirm: () => {
                  if (hasMuted) {
                    unmuteUser.mutate({
                      userId: channelId!,
                    });
                  } else {
                    muteUser.mutate({
                      userId: channelId!,
                    });
                  }
                },
              });
            }}
          >
            {hasMuted ? "Unmute" : "Mute"}
          </DropdownMenuItem>
          {isSubscribed && (
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                openModal("ConfirmModal", {
                  title: "Unsubscribe",
                  destructive: true,
                  description: `Are you sure you want to unsubscribe from this channel?`,
                  onConfirm: () => {
                    if (!channelId) {
                      return;
                    }

                    unsubscribe.mutate({
                      channelId,
                    });
                  },
                });
              }}
            >
              Unsubscribe
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
