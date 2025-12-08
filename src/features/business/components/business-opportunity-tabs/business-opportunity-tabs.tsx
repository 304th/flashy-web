"use client";

import { cn } from "@/lib/utils";

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

const tabs: { id: BusinessTabType; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "media", label: "Media" },
  { id: "description", label: "Description & Deliverables" },
  { id: "terms", label: "Terms & Conditions" },
  { id: "agreements", label: "Agreements" },
];

export function BusinessOpportunityTabs({
  activeTab,
  onTabChange,
}: BusinessOpportunityTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-base-600">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            `cursor-pointer pb-3 text-sm font-medium transition-colors border-b-2
            -mb-px whitespace-nowrap`,
            activeTab === tab.id
              ? "text-white border-brand-100"
              : "text-base-800 border-transparent hover:text-white"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
