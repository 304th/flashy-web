"use client";

import { useLiveQuery } from "@tanstack/react-db";
import { socialFeedCollection } from "@/features/social/collections/social-feed";

export default function TestPage() {
  const { data } = useLiveQuery((query) =>
    query.from({ socialFeed: socialFeedCollection }),
  );

  return (
    <div className="flex flex-col gap-4 w-[600px]">
      {data.map((item) => (
        <p key={item.id}>
          {item.id} - {item.name}
        </p>
      ))}
      <button
        onClick={() => {
          socialFeedCollection.insert({
            id: (Math.random() * 100).toFixed(0),
            name: (Math.random() * 1000000000).toFixed(0),
          });
        }}
      >
        Add
      </button>
    </div>
  );
}
