"use client";

import { Suspense } from "react";
import { ChallengesOverview } from "@/features/gamification";

export default function ProfileChallengesPage() {
  return (
    <Suspense>
      <ChallengesOverview />
    </Suspense>
  );
}
