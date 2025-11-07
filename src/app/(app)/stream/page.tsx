"use client";

import { StreamSearch } from "@/features/streams/components/stream-search/stream-search";

export default function StreamsPage() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-4xl font-bold text-white">Streams</h1>
      <StreamSearch />
    </div>
  );
}
