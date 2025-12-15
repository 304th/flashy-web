"use client";

import { ContentTabs } from "@/components/ui/content-tabs";

export type BusinessTabType =
  | "account"
  | "media"
  | "description"
  | "terms"
  | "agreements";

interface BusinessOpportunityTabsProps {
  activeTab: BusinessTabType;
  onTabChange: (tab: BusinessTabType) => void;
}

const tabs: { value: BusinessTabType; label: string }[] = [
  { value: "account", label: "Account" },
  { value: "media", label: "Media" },
  { value: "description", label: "Description & Deliverables" },
  { value: "terms", label: "Terms & Conditions" },
  { value: "agreements", label: "Agreements" },
];

export function BusinessOpportunityTabs({
  activeTab,
  onTabChange,
}: BusinessOpportunityTabsProps) {
  return (
    <ContentTabs<BusinessTabType>
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}
