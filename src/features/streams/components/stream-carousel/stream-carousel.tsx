"use client";

import { useRef } from "react";
import Link from "next/link";
import { StreamCardV2 } from "@/features/streams/components/stream-card-v2/stream-card-v2";
import { NotFound } from "@/components/ui/not-found";
import { Loadable } from "@/components/ui/loadable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const StreamCarousel = ({
  title,
  query,
}: {
  title: string;
  query: TODO;
}) => {
  const { data: streams } = query;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // 300px width + 20px gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <p className="text-white text-lg font-medium">{title}</p>
        <div className="flex items-center gap-2">

          <Link
            href="/stream"
            className="text-brand-200 transition hover:bg-brand-100/10 py-[2px]
              px-2 rounded-md"
          >
            More Streams
          </Link>
          <Button
            onClick={() => scroll("left")}
            variant="secondary"
            size="sm"
            aria-label="Scroll left"
            className="aspect-square p-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => scroll("right")}
            variant="secondary"
            size="sm"
            aria-label="Scroll right"
            className="aspect-square p-0"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 w-full overflow-x-auto scrollbar-hide"
      >
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
                  className="max-w-[300px] flex-shrink-0"
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
  <div className="flex items-center gap-4 w-full">
    <div className="skeleton flex rounded h-[272px] max-w-[300px] w-[300px] flex-shrink-0" />
    <div className="skeleton flex rounded h-[272px] max-w-[300px] w-[300px] flex-shrink-0" />
    <div className="skeleton flex rounded h-[272px] max-w-[300px] w-[300px] flex-shrink-0" />
    <div className="skeleton flex rounded h-[272px] max-w-[300px] w-[300px] flex-shrink-0" />
    <div className="skeleton flex rounded h-[272px] max-w-[300px] w-[300px] flex-shrink-0" />
  </div>
);
