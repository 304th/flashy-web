'use client';

import {useStreamsLiveUpdates} from "@/features/streams/hooks/use-streams-live-updates";

export const LiveEventsProvider = () => {
  useStreamsLiveUpdates();

  return null;
}