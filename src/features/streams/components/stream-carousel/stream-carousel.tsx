import Link from "next/link";
import { StreamCardV2 } from "@/features/streams/components/stream-card-v2/stream-card-v2";
import { NotFound } from "@/components/ui/not-found";
import { Loadable } from "@/components/ui/loadable";

export const StreamCarousel = ({
  title,
  query,
}: {
  title: string;
  query: TODO;
}) => {
  const { data: streams } = query;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <p className="text-white text-lg font-medium">{title}</p>
        <Link
          href="/stream"
          className="text-brand-200 transition hover:bg-brand-100/10 py-[2px]
            px-2 rounded-md"
        >
          More Streams
        </Link>
      </div>
      <div className="flex items-center gap-4 w-full overflow-x-auto">
        <Loadable
          queries={[query]}
          fullScreenForDefaults
          fallback={<Fallback />}
        >
          {() =>
            streams && streams?.length > 0 ? (
              streams.map((stream: Stream) => (
                <StreamCardV2
                  key={stream._id}
                  stream={stream}
                  className="max-w-[300px]"
                />
              ))
            ) : (
              <div className="flex w-full justify-center items-center">
                <NotFound>Streams not found</NotFound>
              </div>
            )
          }
        </Loadable>
      </div>
    </div>
  );
};

const Fallback = () => (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      gap-4 w-full h-[272px]"
  >
    <div className="skeleton flex rounded" />
    <div className="skeleton flex rounded" />
    <div className="skeleton flex rounded" />
    <div className="skeleton flex rounded" />
  </div>
);
