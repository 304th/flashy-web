"use client";

import { Loadable } from "@/components/ui/loadable";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/ui/user-profile";
import { ShareIcon } from "@/components/ui/icons/share2";
import { BoltTipIcon } from "@/components/ui/icons/bolt-tip";
import { ChannelMenu } from "@/features/channels/components/channel-header/channel-menu";
import { ChannelSubscribeButton } from "@/features/channels/components/channel-subscribe-button/channel-subscribe-button";
import { ChannelMessageButton } from "@/features/channels/components/channel-header/channel-message-button";
import { ChannelSubscriptions } from "@/features/channels/components/channel-subscriptions/channel-subscriptions";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";
import { useModals } from "@/hooks/use-modals";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";

export const ChannelHeaderUserBar = ({ className }: { className?: string }) => {
  const { channelId, channel, channelQuery, stream } = useChannelContext();
  const { openModal } = useModals();
  const { requireAuth } = useProtectedAction();

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
                <Button
                  variant="secondary"
                  className="w-fit"
                  onClick={requireAuth(() => {
                    openModal("TipModal", {
                      user: channel,
                      post: {
                        type: "user",
                        id: channelId,
                        title: `${channel.username}'s Channel`,
                      },
                    });
                  })}
                >
                  <BoltTipIcon />
                  Tip
                </Button>
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
                <ChannelMessageButton channel={channel} />
                <ChannelMenu />
              </div>
            </UserProfile>
          ) : null
        }
      </Loadable>
      <div className="flex w-1/5 min-w-[270px] flex-col items-center gap-2">
        <ChannelSubscribeButton
          channel={{
            fbId: channel?.fbId!,
            username: channel?.username!,
            userimage: channel?.userimage!,
          }}
          loading={channelQuery.isLoading}
          className="w-full"
        />
        <ChannelSubscriptions />
      </div>
    </div>
  );
};
