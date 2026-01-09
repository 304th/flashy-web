import { Button } from "@/components/ui/button";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import {BoltTipIcon} from "@/components/ui/icons/bolt-tip";
import { ShareIcon } from "@/components/ui/icons/share2";
import { VideoPostMenu } from "@/features/video/components/video-post/video-post-menu";
import { useModals } from "@/hooks/use-modals";
import { useVideoPostOwned } from "@/features/video/hooks/use-video-post-owned";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";

export const VideoWatchOptions = ({ videoPost }: { videoPost: VideoPost }) => {
  const { openModal } = useModals();
  const isVideoOwned = useVideoPostOwned(videoPost);
  const { requireAuth } = useProtectedAction();

  return (
    <div className="flex w-full items-center justify-between">
      <LikeButton post={videoPost} className="border text-white h-[36px] p-2" />
      <div className="flex items-center gap-2">
        {/*<Button*/}
        {/*  variant="secondary"*/}
        {/*  className="!w-fit"*/}
        {/*>*/}
        {/*  <MessageIcon />*/}
        {/*  Comment*/}
        {/*</Button>*/}
        {!isVideoOwned && (
          <Button
            variant="secondary"
            className="!w-fit"
            onClick={requireAuth(() =>
              openModal("TipModal", {
                user: {
                  fbId: videoPost.hostID,
                  username: videoPost.username,
                  userimage: videoPost.userimage || "",
                },
                post: {
                  type: "story",
                  id: videoPost._id,
                  title: videoPost.title || "Video",
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
          className="!w-fit"
          onClick={() =>
            openModal("ShareModal", {
              id: videoPost._id,
              type: "video",
            })
          }
        >
          <ShareIcon />
          Share
        </Button>
        <VideoPostMenu videoPost={videoPost} size="default" />
      </div>
    </div>
  );
};
