"use client";

import { ShareIcon } from "lucide-react";
import { Loadable } from "@/components/ui/loadable";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/ui/user-profile";
import { useModals } from "@/hooks/use-modals";
import { useMe } from "@/features/auth/queries/use-me";
import { ChannelSubscriptions } from "@/features/channels/components/channel-subscriptions/channel-subscriptions";

export const ProfileHeaderUserBar = ({ className }: { className?: string }) => {
  const { data: me, query } = useMe();
  const { openModal } = useModals();

  return (
    <div
      className={`flex w-full items-center justify-between px-5 py-2
        ${className}`}
    >
      <Loadable queries={[query]}>
        {() =>
          me ? (
            <UserProfile user={me} isLinkable={false} avatarClassname="size-20">
              <Button
                variant="secondary"
                className="w-fit"
                onClick={() =>
                  openModal("ShareModal", {
                    id: me?.fbId,
                    type: "channel",
                  })
                }
              >
                <ShareIcon />
                Share
              </Button>
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
        <ChannelSubscriptions channel={me} />
      </div>
    </div>
  );
};
