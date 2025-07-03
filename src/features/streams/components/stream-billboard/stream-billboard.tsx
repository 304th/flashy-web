"use client";

import { NotFound } from "@/components/ui/not-found";
import { Loadable } from "@/components/ui/loadable";
import { FeaturedStream } from "@/features/streams/components/stream-billboard/featured-stream";
import { useFeaturedStream } from "@/features/streams/queries/useFeaturedStream";

export const StreamBillboard = () => {
  const [featuredStream, query] = useFeaturedStream();

  return (
    <div
      className="flex w-full bg-base-200
        inset-shadow-[0_0_8px_0_rgba(0,0,0,0.1)] inset-shadow-base-300 h-[390px]
        rounded-md border overflow-hidden"
    >
      <Loadable queries={[query]} fallbackFull>
        {() =>
          featuredStream ? (
            <FeaturedStream stream={featuredStream} />
          ) : (
            <NotFound fullWidth>No streaming events yet.</NotFound>
          )
        }
      </Loadable>
    </div>
  );
};
