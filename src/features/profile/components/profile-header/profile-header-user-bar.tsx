"use client";

import { Loadable } from "@/components/ui/loadable";
import { Button } from "@/components/ui/button";
import { ShareIcon } from "@/components/ui/icons/share2";
import { UserProfile } from "@/components/ui/user-profile";
import { ChannelSubscriptions } from "@/features/channels/components/channel-subscriptions/channel-subscriptions";
import { XpStatusBadge } from "@/features/gamification";
import { useModals } from "@/hooks/use-modals";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";

export const ProfileHeaderUserBar = ({ className }: { className?: string }) => {
  const { channel, channelQuery, stream } = useChannelContext();
  const { openModal } = useModals();

  return (
    <div
      className={`flex w-full items-center justify-between px-5 py-2
        ${className}`}
    >
      <Loadable queries={[channelQuery]}>
        {() =>
          channel ? (
            <UserProfile
              user={channel}
              stream={stream}
              isLive={stream?.isLive}
              isLinkable={false}
              showImage={true}
              avatarClassname="size-20"
            >
              <div className="flex items-center gap-2">
                <XpStatusBadge />
                <Button
                  variant="secondary"
                  className="w-fit"
                  onClick={() =>
                    openModal("ShareModal", {
                      id: channel?.fbId,
                      type: "channel",
                    })
                  }
                >
                  <ShareIcon />
                  Share
                </Button>
              </div>
            </UserProfile>
          ) : null
        }
      </Loadable>
      <div className="flex w-1/5 min-w-[270px] flex-col items-center gap-2">
        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={() => openModal("ProfileSettingsModal")}
        >
          Edit Profile
        </Button>
        <ChannelSubscriptions />
      </div>
    </div>
  );
};
