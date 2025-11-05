"use client";

import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { StreamWatch } from "@/features/streams/components/stream-watch/stream-watch";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStreamById } from "@/features/streams/queries/use-stream-by-id";

export default function StreamPage() {
  const id = useQueryParams("id");
  const [stream, query] = useStreamById(id!);

  if (!id) {
    return <StreamNotFound />;
  }

  return (
    <Loadable
      queries={[query]}
      fallback={<div className="relative aspect-video skeleton rounded"></div>}
    >
      {() =>
        stream ? (
          <StreamWatch key={stream.id} stream={stream} />
        ) : (
          <StreamNotFound />
        )
      }
    </Loadable>
  );
}

const StreamNotFound = () => <NotFound>Stream does not exist.</NotFound>;
