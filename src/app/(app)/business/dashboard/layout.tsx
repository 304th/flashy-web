"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Button } from "@/components/ui/button";
import { CreatorDashboardMenuButton } from "@/features/monetise/components/creator-dashboard-menu-button/creator-dashboard-menu-button";
import { ContentTabs } from "@/components/ui/content-tabs";

type TabValue = "opportunities" | "payments" | "analytics";

const creatorDashboardTabs: { value: TabValue; label: string }[] = [
  { value: "opportunities", label: "Opportunities" },
  { value: "payments", label: "Payments" },
  { value: "analytics", label: "Analytics" },
];

export default function BusinessDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the current tab from pathname
  const currentTab = pathname.split("/").pop() as TabValue;
  const activeTab = creatorDashboardTabs.some((tab) => tab.value === currentTab)
    ? currentTab
    : "opportunities";

  const handleTabChange = (tab: TabValue) => {
    router.push(`/business/dashboard/${tab}`);
  };

  return (
    <div className="flex flex-col max-w-page">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div>
            <GoBackButton />
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl text-white font-medium">
              Business Dashboard
            </h1>
            <div className="flex gap-3 items-center">
              <Button size="lg">Withdraw Funds</Button>
              <Button size="lg">Add Funds</Button>
              <CreatorDashboardMenuButton />
            </div>
          </div>
        </div>
        <ContentTabs
          tabs={creatorDashboardTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
      {children}
    </div>
  );
}
