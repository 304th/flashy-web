import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/features/video/components/video-player/video-player";
import { VideoTimestamp } from "@/features/video/components/video-post/video-post-description";
import { CommentsFeed } from "@/features/comments/components/comments-feed/comments-feed";
import { CommentSend } from "@/features/comments/components/comment-send/comment-send";
import { UserProfile } from "@/components/ui/user-profile";
import { useVideoPostOwned } from "@/features/video/hooks/use-video-post-owned";
import { VideoWatchOptions } from "@/features/video/components/video-watch/video-watch-options";

export const VideoWatch = ({ videoPost }: { videoPost: VideoPost }) => {
  const [replyComment, setReplyComment] = useState<CommentPost | null>(null);
  const isVideoOwned = useVideoPostOwned(videoPost);

  return (
    <div className="flex flex-col w-full gap-4">
      <VideoPlayer videoPost={videoPost} />
      <div className="flex flex-col w-full gap-2">
        <p className="text-white font-medium text-2xl">{videoPost.title}</p>
        {videoPost.description && (
          <p className="whitespace-pre-wrap text-wrap">
            {videoPost.description}
          </p>
        )}
        <p className="text-white">
          {videoPost.views || 0} views •
          <VideoTimestamp createdAt={videoPost.createdAt} />
        </p>
      </div>
      <VideoWatchOptions videoPost={videoPost} />
      <div className="flex w-full justify-between items-center">
        <UserProfile
          user={{
            fbId: videoPost.hostID,
            username: videoPost.username,
            userimage: videoPost.userimage!,
          }}
        />
        {!isVideoOwned && <Button>Subscribe</Button>}
      </div>
      <CommentsFeed
        post={videoPost}
        className="!overflow-auto !max-h-full"
        onCommentReply={(comment) => setReplyComment(comment)}
      />
      <div
        className="sticky bottom-0 pb-4 w-full shrink-0 bg-[#11111180]
          backdrop-blur-xl"
      >
        <CommentSend
          post={videoPost}
          replyComment={replyComment}
          className="rounded-br-md rounded-bl-md z-1 border"
          onCloseReply={() => setReplyComment(null)}
        />
      </div>
    </div>
  );
};
