import {useMemo, useRef} from "react";
// import MuxPlayer from "@mux/mux-player-react/lazy";
import ApiVideoPlayer from "@api.video/react-player";
import { Loadable } from "@/components/ui/loadable";
import { useUploadedVideoConfig } from "@/features/video/queries/use-uploaded-video-config";
import { NotFound } from "@/components/ui/not-found";

interface VideoPlayerProps {
  videoPost: VideoPost;
  onEnded?: () => void;
  onPlay?: () => void;
  onFirstPlay?: () => void;
  onPause?: () => void;
}

const extractPrivateToken = (playbackSrc: string) => {
  return useMemo(() => {
    try {
      const url = new URL(playbackSrc);

      return url.searchParams.get('token') || '';
    } catch {
      return ''
    }
  }, [playbackSrc]);
}

export const VideoPlayer = ({
  videoPost,
  onEnded,
  onPlay,
  onFirstPlay,
  onPause,
}: VideoPlayerProps) => {
  const firstPlayed = useRef<boolean>(false);
  const token = extractPrivateToken(videoPost.playbackAssets.player);
  // const [videoConfig, query] = useUploadedVideoConfig(videoPost.videoId);


  return (
    <ApiVideoPlayer
      key={videoPost.videoId}
      video={{ id: videoPost.videoId, token }}
      hideTitle
      style={{ width: "100%", height: "100%", aspectRatio: 16/9 }}
      onEnded={onEnded}
      onFirstPlay={onFirstPlay}
      onPlay={onPlay}
      onPause={onPause}
      autoplay={false}
    >
      {/*<VideoThumbnail thumbnail={videoPost.storyImage} />*/}
    </ApiVideoPlayer>
  )
  // return (
  //     <MuxPlayer
  //     streamType="on-demand"
  //     src={videoPost?.playbackAssets.mp4}
  //     accentColor="#0f8259"
  //     style={{
  //       display: "relative",
  //       width: "100%",
  //       height: "100%",
  //       border: "none",
  //     }}
  //     onEnded={onEnded}
  //     onPlay={() => {
  //       if (!firstPlayed.current) {
  //         firstPlayed.current = true;
  //         onFirstPlay?.();
  //       }
  //
  //       onPlay?.();
  //     }}
  //     onPause={onPause}
  //   >
  //     <VideoThumbnail thumbnail={videoPost.storyImage} />
  //   </MuxPlayer>
  // )
  // // return (
  //   // <div className="relative aspect-video bg-base-150 rounded overflow-hidden">
  //   //   <Loadable
  //   //     queries={[query]}
  //   //     fallback={<VideoThumbnail thumbnail={videoPost.storyImage} />}
  //   //     error={
  //   //       <div className="flex w-full h-full justify-center items-center">
  //   //         <NotFound>Video Not Available</NotFound>
  //   //       </div>
  //   //     }
  //   //   >
  //   //     {/*{() => (*/}
  //       {/*  // <MuxPlayer*/}
  //       {/*  //   streamType="on-demand"*/}
  //       {/*  //   src={videoConfig?.video?.src}*/}
  //       {/*  //   accentColor="#0f8259"*/}
  //       {/*  //   style={{*/}
  //       {/*  //     display: "relative",*/}
  //       {/*  //     width: "100%",*/}
  //       {/*  //     height: "100%",*/}
  //       {/*  //     border: "none",*/}
  //       {/*  //   }}*/}
  //       {/*  //   onEnded={onEnded}*/}
  //       {/*  //   onPlay={() => {*/}
  //       {/*  //     if (!firstPlayed.current) {*/}
  //       {/*  //       firstPlayed.current = true;*/}
  //       {/*  //       onFirstPlay?.();*/}
  //       {/*  //     }*/}
  //       {/*  //*/}
  //       {/*  //     onPlay?.();*/}
  //       {/*  //   }}*/}
  //       {/*  //   onPause={onPause}*/}
  //       {/*  // >*/}
  //       {/*  //   <VideoThumbnail thumbnail={videoPost.storyImage} />*/}
  //       {/*  // </MuxPlayer>*/}
  //   //     {/*)}*/}
  //   //     {() => (
  //   //       <ApiVideoPlayer
  //   //         key={videoPost.videoId}
  //   //         video={{ id: videoPost.videoId }}
  //   //         style={{ width: "100%", height: "100%" }}
  //   //         onEnded={onEnded}
  //   //         onFirstPlay={onFirstPlay}
  //   //         onPlay={onPlay}
  //   //         onPause={onPause}
  //   //         autoplay={false}
  //   //       >
  //   //         <VideoThumbnail thumbnail={videoPost.storyImage} />
  //   //       </ApiVideoPlayer>
  //   //     )}
  //   //
  //   //   </Loadable>
  //   //
  //   //   <ApiVideoPlayer
  //   //     key={videoPost.videoId}
  //   //     video={{ id: videoPost.videoId }}
  //   //     style={{ width: "100%", height: "100%" }}
  //   //     onEnded={onEnded}
  //   //     onFirstPlay={onFirstPlay}
  //   //     onPlay={onPlay}
  //   //     onPause={onPause}
  //   //     autoplay={false}
  //   //   />
  //   // </div>
  // // );
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
