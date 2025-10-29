import MuxPlayer from "@mux/mux-player-react/lazy";
import { Loadable } from "@/components/ui/loadable";
import { useUploadedVideoConfig } from "@/features/video/queries/use-uploaded-video-config";
import { useRef } from "react";

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
  const firstPlayed = useRef<boolean>(false);
  const [videoConfig, query] = useUploadedVideoConfig(videoPost.videoId);

  return (
    <div className="relative aspect-video bg-base-150 rounded overflow-hidden">
      <Loadable
        queries={[query]}
        fallback={<VideoThumbnail thumbnail={videoPost.storyImage} />}
      >
        {() => (
          <MuxPlayer
            streamType="on-demand"
            src={videoConfig?.video?.src}
            accentColor="#0f8259"
            style={{
              display: "relative",
              width: "100%",
              height: "100%",
              border: "none",
            }}
            onEnded={onEnded}
            onPlay={() => {
              if (!firstPlayed.current) {
                firstPlayed.current = true;
                onFirstPlay?.();
              }

              onPlay?.();
            }}
            onPause={onPause}
          >
            <VideoThumbnail thumbnail={videoPost.storyImage} />
          </MuxPlayer>
        )}
      </Loadable>

      {/*<ApiVideoPlayer*/}
      {/*  key={videoPost.videoId}*/}
      {/*  video={{ id: videoPost.videoId }}*/}
      {/*  style={{ width: "100%", height: "100%" }}*/}
      {/*  onEnded={onEnded}*/}
      {/*  onFirstPlay={onFirstPlay}*/}
      {/*  onPlay={onPlay}*/}
      {/*  onPause={onPause}*/}
      {/*  autoplay={false}*/}
      {/*/>*/}
    </div>
  );
};

const VideoThumbnail = ({ thumbnail }: { thumbnail: string }) => {
  return (
    <div
      className={"w-full h-full bg-cover bg-center rounded"}
      slot="poster"
      style={{ backgroundImage: `url(${thumbnail})` }}
      role="img"
      aria-label="Video Post Thumbnail"
    />
  );
};
