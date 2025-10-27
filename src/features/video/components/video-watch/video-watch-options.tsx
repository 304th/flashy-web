import { Button} from "@/components/ui/button";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { BlazeTipIcon } from "@/components/ui/icons/blaze-tip";
import { ShareIcon } from "@/components/ui/icons/share2";
import { VideoPostMenu } from "@/features/video/components/video-post/video-post-menu";
import { useModals } from "@/hooks/use-modals";

export const VideoWatchOptions = ({ videoPost }: { videoPost: VideoPost }) => {
  const { openModal } = useModals()

  return <div className="flex w-full items-center justify-between">
    <LikeButton post={videoPost} className="border text-white h-[36px] p-2" />
    <div className="flex items-center gap-2">
      {/*<Button*/}
      {/*  variant="secondary"*/}
      {/*  className="!w-fit"*/}
      {/*>*/}
      {/*  <MessageIcon />*/}
      {/*  Comment*/}
      {/*</Button>*/}
      <Button
        variant="secondary"
        className="!w-fit"
      >
        <BlazeTipIcon />
        Tip
      </Button>
      <Button
        variant="secondary"
        className="!w-fit"
        onClick={() =>  openModal("ShareModal", {
          id: videoPost._id,
          type: "video",
        })}
      >
        <ShareIcon />
        Share
      </Button>
      <VideoPostMenu videoPost={videoPost} size="default" />
    </div>
  </div>
}