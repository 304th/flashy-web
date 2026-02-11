"use client";

import { Suspense } from "react";
import { ChallengesOverview } from "@/features/gamification";

export default function ChannelChallengesPage() {
  return (
    <Suspense>
      <ChallengesOverview />
    </Suspense>
  );
}
