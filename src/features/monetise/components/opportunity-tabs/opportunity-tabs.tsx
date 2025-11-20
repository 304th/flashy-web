"use client";

import { cn } from "@/lib/utils";

type TabType = "description" | "terms";

interface OpportunityTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function OpportunityTabs({ activeTab, onTabChange }: OpportunityTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-base-600">
      <button
        onClick={() => onTabChange("description")}
        className={cn(
          "pb-3 text-sm font-medium transition-colors border-b-2 -mb-px",
          activeTab === "description"
            ? "text-white border-brand-100"
            : "text-base-800 border-transparent hover:text-white"
        )}
      >
        Description & Deliverables
      </button>
      <button
        onClick={() => onTabChange("terms")}
        className={cn(
          "pb-3 text-sm font-medium transition-colors border-b-2 -mb-px",
          activeTab === "terms"
            ? "text-white border-brand-100"
            : "text-base-800 border-transparent hover:text-white"
        )}
      >
        Terms & Conditions
      </button>
    </div>
  );
}

export type { TabType };
