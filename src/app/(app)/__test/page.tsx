'use client';

import { useLiveQuery } from "@tanstack/react-db";
import {getSocialFeedCollection } from "@/features/social/collections/social-feed";

export default function TestPage() {
  // const { data, collection } = useLiveQuery((query) => query.from({ socialFeed: getSocialFeedCollection('1') }));

  return (
    <div className="flex flex-col gap-4 w-[600px]">
    </div>
  );
}
