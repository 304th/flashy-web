import ApiVideoPlayer from "@api.video/react-player";

export const VideoPlayer = ({ videoPost }: { videoPost: VideoPost }) => {
  return (
    <div className="aspect-video bg-base-150">
      <ApiVideoPlayer
        video={{ id: videoPost.videoId }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
