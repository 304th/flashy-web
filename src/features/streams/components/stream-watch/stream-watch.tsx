import { EyeIcon } from "@/components/ui/icons/eye";
import { StreamPlayer } from "@/features/streams/components/stream-player/stream-player";
import { StreamWatchOffline } from "@/features/streams/components/stream-watch/stream-watch-offline";
import { StreamWatchDescription } from "@/features/streams/components/stream-watch/stream-watch-description";
import { StreamWatchTimestamp } from "@/features/streams/components/stream-watch/stream-watch-timestamp";
import { StreamWatchOptions } from "@/features/streams/components/stream-watch/stream-watch-options";
import { LiveTag } from "@/components/ui/live-tag";

export const StreamWatch = ({ stream }: { stream: Stream }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="relative">
        {stream.isLive ? (
          <StreamPlayer
            key={stream._id}
            videoId={stream.externalStreamId}
            isLive={stream.isLive}
            autoplay={true}
          />
        ) : (
          <StreamWatchOffline stream={stream} />
        )}
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex gap-4">
          <p className="text-white font-medium text-2xl">{stream.title}</p>
          {stream.isLive && <LiveTag />}
        </div>
        <StreamWatchDescription stream={stream} />
        <div className="flex items-center gap-2 text-white">
          <EyeIcon />
          <p>
            {stream.viewerCount || 0} viewers
            {stream.status === "ended" ? (
              <span>
                • Stream ended
                <StreamWatchTimestamp timestamp={stream.startedAt} />
              </span>
            ) : null}
          </p>
        </div>
      </div>
      <StreamWatchOptions stream={stream} />
    </div>
  );
};
