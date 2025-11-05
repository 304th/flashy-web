import Link from "next/link";
import { StreamCardDescription } from "@/features/streams/components/stream-card-v2/stream-card-description";
import { StreamCardStatus } from "@/features/streams/components/stream-card-v2/stream-card-status";
import { StreamCardMenu } from "@/features/streams/components/stream-card-v2/stream-card-menu";

export const StreamCardV2 = ({
  stream,
  horizontal,
  className,
}: {
  stream: Optimistic<Stream>;
  horizontal?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`group relative flex flex-col gap-2 w-full items-center
        bg-[linear-gradient(180deg,#151515_0%,#151515_0.01%,#33333320_100%)]
        ${className} rounded`}
    >
      <Link
        href={`/stream/post?id=${stream.id}`}
        className={`flex flex-col w-full gap-2 rounded-md transition
          group-hover:bg-base-300 p-2 ${horizontal ? "flex-row" : ""}`}
      >
        <div
          className={`relative w-full h-[180px] shrink-0 bg-cover bg-center
            rounded
            ${horizontal ? "h-[110px]! !shrink-0 !w-fit aspect-video" : ""}`}
          style={{ backgroundImage: `url(${stream.thumbnail})` }}
          role="img"
          aria-label="Stream Thumbnail"
        >
          <StreamCardStatus stream={stream} />
        </div>
        <StreamCardDescription
          stream={stream}
          className={horizontal ? "max-w-[67%] text-[14px]" : "w-full"}
        />
      </Link>
      <div className="absolute top-3 right-3">
        <StreamCardMenu stream={stream} />
      </div>
    </div>
  );
};
