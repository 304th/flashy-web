"use client";

import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { StreamCardV2 } from "@/features/streams/components/stream-card-v2/stream-card-v2";
import { useLiveStreams } from "@/features/streams/queries/use-live-streams";

export default function StreamsPage() {
  const { data: streams, query } = useLiveStreams();

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-4xl font-bold text-white">Live Streams</h1>
      <Loadable queries={[query]}>
        {() =>
          streams && streams.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {streams.map((stream) => (
                <StreamCardV2 key={stream.id} stream={stream} />
              ))}
            </div>
          ) : (
            <NotFound>No live streams at the moment.</NotFound>
          )
        }
      </Loadable>
    </div>
  );
}
