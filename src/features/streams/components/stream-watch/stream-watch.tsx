import { EyeIcon } from "@/components/ui/icons/eye";
import { StreamPlayer } from "@/features/streams/components/stream-player/stream-player";
import { StreamWatchOffline } from "@/features/streams/components/stream-watch/stream-watch-offline";
import { StreamWatchDescription } from "@/features/streams/components/stream-watch/stream-watch-description";
import { StreamWatchTimestamp } from "@/features/streams/components/stream-watch/stream-watch-timestamp";
import { StreamWatchOptions } from "@/features/streams/components/stream-watch/stream-watch-options";
import { LiveTag } from "@/components/ui/live-tag";
import { useStreamViewersLiveUpdates } from "@/features/streams/hooks/use-stream-viewers-live-updates";

export const StreamWatch = ({ stream }: { stream: Stream }) => {
  // Enable live viewer count updates via WebSocket
  const { viewerCount } = useStreamViewersLiveUpdates(stream._id);

  // Use live viewer count if available, otherwise fall back to stream data
  const displayViewerCount = viewerCount ?? stream.viewerCount ?? 0;

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
            {displayViewerCount} viewers
            {stream.status === "ended" ? (
              <span>
                {' '}• Stream ended
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
