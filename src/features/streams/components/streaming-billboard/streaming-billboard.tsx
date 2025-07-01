"use client";

import { NotFound } from "@/components/ui/not-found";
import { Loadable } from "@/components/ui/loadable";
import { BillboardStream } from "@/features/streams/components/streaming-billboard/billboard-stream";
import { useFeaturedStream } from "@/features/streams/queries/useFeaturedStream";

export const StreamingBillboard = () => {
  const [featuredStream, query] = useFeaturedStream();

  return (
    <div
      className="flex w-full bg-base-200
        inset-shadow-[0_0_8px_0_rgba(0,0,0,0.1)] inset-shadow-base-300 h-[376px]
        rounded-md border overflow-hidden"
    >
      <Loadable queries={[query]} fallbackFull>
        {() =>
          featuredStream ? (
            <BillboardStream stream={featuredStream} />
          ) : (
            <NotFound fullWidth>No streaming events yet.</NotFound>
          )
        }
      </Loadable>
    </div>
  );
};
