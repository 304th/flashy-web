'use client';

import {FC, type ReactNode} from "react";
import { GoBackButton } from "@/components/ui/go-back-button";
import {Button} from "@/components/ui/button";
import {
  CreatorDashboardMenuButton
} from "@/features/monetise/components/creator-dashboard-menu-button/creator-dashboard-menu-button";
import { ContentTabs } from "@/components/ui/content-tabs";
import {FilterType} from "@/features/monetise";

const creatorDashboardTabs: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "partnership", label: "Partnership" },
  { value: "affiliate", label: "Affiliate" },
];

export default function CreatorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="flex flex-col max-w-page">
    <div className="flex flex-col gap-2">
      <div>
        <GoBackButton />
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-white font-medium">Creator Dashboard</h1>
        <div className="flex gap-3 items-center">
          <Button size="lg">
            Withdraw Funds
          </Button>
          <CreatorDashboardMenuButton />
        </div>
      </div>
      <ContentTabs tabs={creatorDashboardTabs} activeTab={} onTabChange={} />
    </div>
    {children}
  </div>;
}
