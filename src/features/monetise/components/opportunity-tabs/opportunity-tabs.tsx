"use client";

import { useMemo } from "react";
import { ContentTabs } from "@/components/ui/content-tabs";

type TabType = "description" | "media" | "terms" | "deliverables";

interface OpportunityTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showDeliverables?: boolean;
}

export function OpportunityTabs({
  activeTab,
  onTabChange,
  showDeliverables = false,
}: OpportunityTabsProps) {
  const tabs = useMemo(() => {
    const baseTabs: { value: TabType; label: string }[] = [
      { value: "description", label: "Description & Deliverables" },
      { value: "media", label: "Media" },
      { value: "terms", label: "Terms & Conditions" },
    ];

    if (showDeliverables) {
      baseTabs.push({ value: "deliverables", label: "My Submission" });
    }

    return baseTabs;
  }, [showDeliverables]);

  return (
    <ContentTabs<TabType>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}

export type { TabType };
