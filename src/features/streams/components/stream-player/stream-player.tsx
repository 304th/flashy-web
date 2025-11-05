import ApiVideoPlayer from "@api.video/react-player";

interface StreamPlayerProps {
  videoId: string;
  isLive?: boolean;
  autoplay?: boolean;
}

export const StreamPlayer = ({
  videoId,
  isLive = false,
  autoplay = false,
}: StreamPlayerProps) => {
  const Player = ApiVideoPlayer as any;

  return (
    <div style={{ width: "100%", aspectRatio: "16/9" }}>
      <Player
        video={{ id: videoId }}
        live={isLive}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
