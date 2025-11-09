import ApiVideoPlayer from "@api.video/react-player";

interface StreamPlayerProps {
  videoId: string;
  isLive?: boolean;
  autoplay?: boolean;
  hideControls?: boolean;
  muted?: boolean;
  className?: string;
}

export const StreamPlayer = ({
  videoId,
  isLive = false,
  autoplay = false,
  hideControls = false,
  muted = false,
  className,
}: StreamPlayerProps) => {
  const Player = ApiVideoPlayer as any;

  return (
    <div
      style={{ width: "100%", aspectRatio: "16/9" }}
      className={`${className}`}
    >
      <Player
        video={{ id: videoId }}
        live={isLive}
        muted={muted}
        hideControls={hideControls}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
