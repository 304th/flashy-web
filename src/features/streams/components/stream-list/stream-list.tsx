import { useState } from "react";
import { StreamCard } from "@/features/streams/components/stream-card/stream-card";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useProfileStreams } from "@/features/profile/queries/use-profile-streams";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";
import {StreamCardV2} from "@/features/streams/components/stream-card-v2/stream-card-v2";

interface StreamListProps {
  userId: string;
  showActions?: boolean;
}

type FilterType = "all" | "upcoming" | "live" | "past";

export const StreamList = ({ userId, showActions = false }: StreamListProps) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const { data, query } = useProfileStreams({ userId, filter });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          onClick={() => setFilter("all")}
          className="rounded-b-none"
        >
          All
        </Button>
        <Button
          variant={filter === "upcoming" ? "default" : "ghost"}
          onClick={() => setFilter("upcoming")}
          className="rounded-b-none"
        >
          Upcoming
        </Button>
        <Button
          variant={filter === "live" ? "default" : "ghost"}
          onClick={() => setFilter("live")}
          className="rounded-b-none"
        >
          <Radio className="mr-2 h-4 w-4" />
          Live
        </Button>
        <Button
          variant={filter === "past" ? "default" : "ghost"}
          onClick={() => setFilter("past")}
          className="rounded-b-none"
        >
          Past
        </Button>
      </div>

      {/* Stream Grid */}
      <Loadable queries={[query as any]}>
        {() =>
          data && data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.map((stream) => (
                <StreamCardV2
                  key={stream.id}
                  stream={stream}
                />
              ))}
            </div>
          ) : (
            <NotFound>
              {filter === "all"
                ? "You haven't created any streams yet."
                : `You don't have any ${filter} streams.`}
            </NotFound>
          )
        }
      </Loadable>
    </div>
  );
};
