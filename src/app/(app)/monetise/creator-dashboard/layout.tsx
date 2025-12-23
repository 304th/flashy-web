"use client";

import { type ReactNode } from "react";
import { GoBackButton } from "@/components/ui/go-back-button";
import { CreatorDashboardTabs } from "@/features/monetise";
// import { CreatorDashboardMenuButton } from "@/features/monetise/components/creator-dashboard-menu-button/creator-dashboard-menu-button";
import { useProtectedRedirect } from "@/features/auth/hooks/use-protected-redirect";

export default function CreatorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  useProtectedRedirect();

  return (
    <div className="flex flex-col gap-6 max-w-page">
      <div className="flex flex-col gap-4">
        <div>
          <GoBackButton />
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-white font-bold">Creator Dashboard</h1>
          {/*<CreatorDashboardMenuButton />*/}
        </div>
      </div>
      <CreatorDashboardTabs />
      {children}
    </div>
  );
}
