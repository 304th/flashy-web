import { useState } from "react";
import { Loadable } from "@/components/ui/loadable";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";
import { StreamCardV2 } from "@/features/streams/components/stream-card-v2/stream-card-v2";
import { useProfileStream } from "@/features/profile/queries/use-profile-stream";

type FilterType = "all" | "upcoming" | "live" | "past";

export const StreamList = () => {
  const [filter, setFilter] = useState<FilterType>("live");
  const { data: stream, query } = useProfileStream();

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {/*<Button*/}
        {/*  variant={filter === "upcoming" ? "default" : "ghost"}*/}
        {/*  onClick={() => setFilter("upcoming")}*/}
        {/*  className="rounded-b-none"*/}
        {/*>*/}
        {/*  Upcoming*/}
        {/*</Button>*/}
        <Button
          variant={filter === "live" ? "default" : "ghost"}
          onClick={() => setFilter("live")}
          className="rounded-b-none w-[100px]"
        >
          <Radio className="h-4 w-4" />
          Stream
        </Button>
        {/*<Button*/}
        {/*  variant={filter === "past" ? "default" : "ghost"}*/}
        {/*  onClick={() => setFilter("past")}*/}
        {/*  className="rounded-b-none w-[100px]"*/}
        {/*>*/}
        {/*  Past*/}
        {/*</Button>*/}
      </div>
      <Loadable queries={[query as any]} fullScreenForDefaults>
        {() =>
          stream?.isLive ? <StreamCardV2 stream={stream} className="max-w-[345px] aspect-video" /> : <div className="flex justify-center items-center w-full h-full gap-4 text-base-600">
            <Radio className="h-10 w-10" />
            <p className="text-3xl font-bold">Offline</p>
        </div>
        }
      </Loadable>
      {/*<Loadable queries={[query as any]} fullScreenForDefaults>*/}
      {/*  {() =>*/}
      {/*    data && data.length > 0 ? (*/}
      {/*      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">*/}
      {/*        {data.map((stream) => (*/}
      {/*          <StreamCardV2*/}
      {/*            key={stream._id}*/}
      {/*            stream={stream}*/}
      {/*          />*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    ) : (*/}
      {/*      <NotFound>*/}
      {/*        {filter === "all"*/}
      {/*          ? "You haven't created any streams yet."*/}
      {/*          : `You don't have any ${filter} streams.`}*/}
      {/*      </NotFound>*/}
      {/*    )*/}
      {/*  }*/}
      {/*</Loadable>*/}
    </div>
  );
};
