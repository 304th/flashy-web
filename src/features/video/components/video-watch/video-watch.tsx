import { useRef, useState } from "react";
import { VideoPlayer } from "@/features/video/components/video-player/video-player";
import { VideoTimestamp } from "@/features/video/components/video-post/video-post-description";
import { CommentsFeed } from "@/features/comments/components/comments-feed/comments-feed";
import { CommentSend } from "@/features/comments/components/comment-send/comment-send";
import { UserProfile } from "@/components/ui/user-profile";
import { ChannelSubscribeButton } from "@/features/channels/components/channel-subscribe-button/channel-subscribe-button";
import { VideoWatchNextButton } from "@/features/video/components/video-watch/video-watch-next-button";
import { VideoWatchOptions } from "@/features/video/components/video-watch/video-watch-options";
import { usePlaylistContext } from "@/features/video/components/video-playlist-context";
import { useVideosInPlaylist } from "@/features/video/queries/use-videos-in-playlist";
import { useQueryParams } from "@/hooks/use-query-params";
import { useWatchVideo } from "@/features/video/mutations/use-watch-video";
import { useVideoPostOwned } from "@/features/video/hooks/use-video-post-owned";

export const VideoWatch = ({ videoPost }: { videoPost: VideoPost }) => {
  const nextVideoButton = useRef<any>(null);
  const [replyComment, setReplyComment] = useState<CommentPost | null>(null);
  const isVideoOwned = useVideoPostOwned(videoPost);
  const { autoplay, playNextVideo } = usePlaylistContext();
  const currentPlaylistId = useQueryParams("playlistId");
  const { data: playlistVideos } = useVideosInPlaylist(
    currentPlaylistId || videoPost.playlist?.fbId,
  );
  const watchVideo = useWatchVideo();

  const handleEnded = () => {
    if (autoplay && playlistVideos) {
      const currentVideoIndex = playlistVideos.findIndex(
        (video) => video._id === videoPost._id,
      );

      if (currentVideoIndex !== playlistVideos.length - 1) {
        nextVideoButton.current?.show(5);
      }
    }
  };

  const handleNext = () => {
    if (videoPost.playlist?.fbId && playlistVideos) {
      playNextVideo(videoPost._id, playlistVideos, videoPost.playlist?.fbId);
    }
  };

  const handleFirstPlay = () => {
    watchVideo.mutate({ id: videoPost._id });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="relative">
        <VideoPlayer
          key={videoPost._id}
          videoPost={videoPost}
          onEnded={handleEnded}
          onFirstPlay={handleFirstPlay}
        />
        <VideoWatchNextButton ref={nextVideoButton} onNext={handleNext} />
      </div>
      <div className="flex flex-col w-full gap-2">
        <p className="text-white font-medium text-2xl">{videoPost.title}</p>
        {videoPost.description && (
          <p className="whitespace-pre-wrap text-wrap">
            {videoPost.description}
          </p>
        )}
        <p className="text-white">
          {videoPost.views || 0} views •{" "}
          <VideoTimestamp createdAt={videoPost.createdAt} />
        </p>
      </div>
      <VideoWatchOptions videoPost={videoPost} />
      <div className="flex w-full justify-between items-center">
        <UserProfile
          user={{
            fbId: videoPost.hostID,
            username: videoPost.username,
            userimage: videoPost.userimage || (videoPost as any).userImage,
          }}
        />
        {!isVideoOwned && (
          <ChannelSubscribeButton
            channel={{
              fbId: videoPost.hostID,
              username: videoPost.username,
              userimage: videoPost.userimage!,
            }}
            className="!w-fit"
          />
        )}
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
          autoFocus={false}
          className="rounded-br-md rounded-bl-md z-1 border"
          onCloseReply={() => setReplyComment(null)}
        />
      </div>
    </div>
  );
};
