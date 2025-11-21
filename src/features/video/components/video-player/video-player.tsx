import { useMemo } from "react";
import ApiVideoPlayer from "@api.video/react-player";

interface VideoPlayerProps {
  videoPost: VideoPost;
  onEnded?: () => void;
  onPlay?: () => void;
  onFirstPlay?: () => void;
  onPause?: () => void;
}

const useExtractPrivateToken = (videoPost: VideoPost) => {
  return useMemo(() => {
    try {
      const url = new URL(videoPost.playbackAssets.player);

      return url.searchParams.get("token") || "";
    } catch {
      return "";
    }
  }, [videoPost]);
};

export const VideoPlayer = ({
  videoPost,
  onEnded,
  onPlay,
  onFirstPlay,
  onPause,
}: VideoPlayerProps) => {
  const token = useExtractPrivateToken(videoPost);

  return (
    <ApiVideoPlayer
      key={videoPost.videoId}
      video={{ id: videoPost.videoId, token }}
      hideTitle
      style={{ width: "100%", height: "100%", aspectRatio: 16 / 9 }}
      onEnded={onEnded}
      onFirstPlay={onFirstPlay}
      onPlay={onPlay}
      onPause={onPause}
      autoplay={false}
      theme={{
        trackPlayed: "rgba(27, 243, 164, 1)",
        text: "rgba(255, 255, 255, 1)",
        link: "rgba(27, 243, 164, 1)",
        linkHover: "rgba(140, 255, 213, 1)",
      }}
    />
  );
};

// const VideoThumbnail = ({ thumbnail }: { thumbnail: string }) => {
//   return (
//     <div
//       className={"w-full h-full bg-cover bg-center rounded"}
//       slot="poster"
//       style={{ backgroundImage: `url(${thumbnail})` }}
//       role="img"
//       aria-label="Video Post Thumbnail"
//     />
//   );
// };
