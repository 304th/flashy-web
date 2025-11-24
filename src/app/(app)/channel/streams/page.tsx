"use client";

import { Radio } from "lucide-react";
import { Loadable } from "@/components/ui/loadable";
import { StreamCardV2 } from "@/features/streams/components/stream-card-v2/stream-card-v2";
import { useChannelStream } from "@/features/channels/queries/use-channel-stream";
import { useChannelContext } from "@/features/profile/components/channel-context/channel-context";

export default function ChannelStreamsPage() {
  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <StreamList />
    </div>
  );
}

const StreamList = () => {
  const { channelId } = useChannelContext();
  const { data: stream, query } = useChannelStream({ channelId });

  return (
    <Loadable queries={[query as any]} fullScreenForDefaults>
      {() =>
        stream?.isLive ? (
          <StreamCardV2
            stream={stream}
            className="max-w-[345px] aspect-video"
          />
        ) : (
          <div
            className="flex justify-center items-center w-full h-full gap-4
              text-base-600"
          >
            <Radio className="h-10 w-10" />
            <p className="text-3xl font-bold">Offline</p>
          </div>
        )
      }
    </Loadable>
  );
};
