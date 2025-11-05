import { useEffect, useRef, useState } from "react";
import { StreamPlayer } from "@/features/streams/components/stream-player/stream-player";
import { StreamControls } from "@/features/streams/components/stream-controls/stream-controls";
import { UserProfile } from "@/components/ui/user-profile";
import { ChannelSubscribeButton } from "@/features/channels/components/channel-subscribe-button/channel-subscribe-button";
import { useMe } from "@/features/auth/queries/use-me";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

export const StreamWatch = ({ stream }: { stream: Stream }) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [showCollapseButton, setShowCollapseButton] = useState(false);
  const { data: me } = useMe();

  const isStreamOwned = useMemo(() => {
    if (!me) return false;
    return me.fbId === stream.userId;
  }, [stream, me]);

  useEffect(() => {
    if (descriptionRef.current) {
      const height = descriptionRef.current.scrollHeight;
      setShowCollapseButton(height > 100);
    }
  }, [stream.description]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="relative">
        <StreamPlayer
          key={stream.id}
          videoId={stream.externalStreamId}
          isLive={stream.isLive}
          autoplay={true}
        />
      </div>

      {/* Stream Status Badge */}
      {stream.isLive && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-sm font-semibold text-white">LIVE</span>
          </div>
          <span className="text-sm text-base-700">
            {stream.viewerCount} {stream.viewerCount === 1 ? "viewer" : "viewers"}
          </span>
        </div>
      )}

      <div className="flex flex-col w-full gap-2">
        <p className="text-white font-medium text-2xl">{stream.title}</p>
        {stream.description && (
          <div className="relative">
            <div
              className={`relative overflow-hidden transition-all duration-300 ${
                isDescriptionCollapsed && showCollapseButton
                  ? "max-h-[100px]"
                  : "max-h-none"
              }`}
            >
              <p
                ref={descriptionRef}
                className="whitespace-pre-wrap text-wrap"
              >
                {stream.description}
              </p>
              {isDescriptionCollapsed && showCollapseButton && (
                <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-b from-transparent to-[#111111]" />
              )}
            </div>
            {showCollapseButton && (
              <button
                onClick={() =>
                  setIsDescriptionCollapsed(!isDescriptionCollapsed)
                }
                className="flex items-center gap-1 text-sm text-base-700 cursor-pointer hover:text-white transition-colors mt-1"
              >
                {isDescriptionCollapsed ? "Show more" : "Show less"}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDescriptionCollapsed ? "" : "rotate-180"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        {stream.startedAt && (
          <p className="text-white text-sm">
            Started{" "}
            {formatDistanceToNow(new Date(stream.startedAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>

      {/* Stream Controls - Only visible to stream owner */}
      {isStreamOwned && <StreamControls stream={stream} />}

      <div className="flex w-full justify-between items-center">
        <UserProfile
          user={{
            fbId: stream.userId,
            username: stream.author.username,
            userimage: stream.author.userimage,
          }}
        />
        {!isStreamOwned && (
          <ChannelSubscribeButton
            channel={{
              fbId: stream.userId,
              username: stream.author.username,
              userimage: stream.author.userimage,
            }}
            className="!w-fit"
          />
        )}
      </div>
    </div>
  );
};
