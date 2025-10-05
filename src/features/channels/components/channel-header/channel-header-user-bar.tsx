"use client";

import { ShareIcon } from "lucide-react";
import { Loadable } from "@/components/ui/loadable";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/ui/user-profile";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";
import { ChannelMenu } from "@/features/channels/components/channel-header/channel-menu";
import { ChannelSubscribeButton } from "@/features/channels/components/channel-subscribe-button/channel-subscribe-button";
import { ChannelSubscriptions } from "@/features/channels/components/channel-subscriptions/channel-subscriptions";
import { useModals } from "@/hooks/use-modals";

export const ChannelHeaderUserBar = ({ className }: { className?: string }) => {
  const { channelId, channel, query } = useChannelContext();
  const { openModal } = useModals();

  return (
    <div
      className={`flex w-full items-center justify-between px-5 py-2
        ${className}`}
    >
      <Loadable queries={[query]}>
        {() =>
          channel ? (
            <UserProfile user={channel} isLinkable={false} avatarClassname="size-20">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="w-fit"
                  onClick={() => {
                    openModal("ShareModal", {
                      id: channelId,
                      type: "channel",
                    });
                  }}
                >
                  <ShareIcon />
                  Share
                </Button>
                <ChannelMenu />
              </div>
            </UserProfile>
          ) : null
        }
      </Loadable>
      <div className="flex w-1/5 flex-col items-center gap-2">
        <ChannelSubscribeButton channelId={channelId} />
        <ChannelSubscriptions channel={channel} />
      </div>
    </div>
  );
};
