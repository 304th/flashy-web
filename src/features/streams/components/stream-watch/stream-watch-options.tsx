import { Button } from "@/components/ui/button";
import { BlazeTipIcon } from "@/components/ui/icons/blaze-tip";
import { ShareIcon } from "@/components/ui/icons/share2";
import { StreamWatchMenu } from "@/features/streams/components/stream-watch/stream-watch-options-menu";
import { useModals } from "@/hooks/use-modals";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";
import { useIsStreamOwned } from "@/features/streams/hooks/use-is-stream-owned";
import { UserProfile } from "@/components/ui/user-profile";
import { ChannelSubscribeButton } from "@/features/channels/components/channel-subscribe-button/channel-subscribe-button";
import { BoltTipIcon } from "@/components/ui/icons/bolt-tip";

export const StreamWatchOptions = ({ stream }: { stream: Stream }) => {
  const { openModal } = useModals();
  const { requireAuth } = useProtectedAction();
  const isStreamOwned = useIsStreamOwned(stream);

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-full justify-between items-center">
        <UserProfile
          user={{
            fbId: stream.userId,
            username: stream.author.username,
            userimage: stream.author.userimage,
          }}
        />
        {!isStreamOwned && (
          <ChannelSubscribeButton
            channel={{
              fbId: stream.userId,
              username: stream.author.username,
              userimage: stream.author.userimage,
            }}
            className="!w-fit"
          />
        )}
      </div>
      {/*<LikeButton post={stream} className="border text-white h-[36px] p-2" />*/}
      <div className="flex items-center gap-2">
        {!isStreamOwned && (
          <Button
            variant="secondary"
            size="lg"
            onClick={requireAuth(() =>
              openModal("TipModal", {
                user: stream.author,
                post: {
                  type: "stream",
                  id: stream._id,
                  title: stream.title || "Stream",
                },
              }),
            )}
          >
            <BoltTipIcon />
            Tip
          </Button>
        )}
        <Button
          variant="secondary"
          size="lg"
          onClick={() =>
            openModal("ShareModal", {
              id: stream._id,
              type: "video",
            })
          }
        >
          <ShareIcon />
          Share
        </Button>
        <StreamWatchMenu stream={stream} size="default" />
      </div>
    </div>
  );
};
