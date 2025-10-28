import ApiVideoPlayer from "@api.video/react-player";

interface VideoPlayerProps {
  videoPost: VideoPost;
  onEnded?: () => void;
  onPlay?: () => void;
  onFirstPlay?: () => void;
  onPause?: () => void;
}

export const VideoPlayer = ({
  videoPost,
  onEnded,
  onPlay,
  onFirstPlay,
  onPause,
}: VideoPlayerProps) => {
  return (
    <div className="aspect-video bg-base-150">
      <ApiVideoPlayer
        key={videoPost.videoId}
        video={{ id: videoPost.videoId }}
        style={{ width: "100%", height: "100%" }}
        onEnded={onEnded}
        onFirstPlay={onFirstPlay}
        onPlay={onPlay}
        onPause={onPause}
        autoplay={false}
      />
    </div>
  );
};
