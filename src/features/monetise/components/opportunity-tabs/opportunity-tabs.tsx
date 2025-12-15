"use client";

import { cn } from "@/lib/utils";

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
  return (
    <div className="flex items-center gap-6 border-b border-base-600">
      <button
        onClick={() => onTabChange("description")}
        className={cn(
          `cursor-pointer pb-3 text-sm font-medium transition-colors border-b-2
          -mb-px`,
          activeTab === "description"
            ? "text-white border-brand-100"
            : "text-base-800 border-transparent hover:text-white",
        )}
      >
        Description & Deliverables
      </button>
      <button
        onClick={() => onTabChange("media")}
        className={cn(
          `cursor-pointer pb-3 text-sm font-medium transition-colors border-b-2
          -mb-px`,
          activeTab === "media"
            ? "text-white border-brand-100"
            : "text-base-800 border-transparent hover:text-white",
        )}
      >
        Media
      </button>
      <button
        onClick={() => onTabChange("terms")}
        className={cn(
          `cursor-pointer pb-3 text-sm font-medium transition-colors border-b-2
          -mb-px`,
          activeTab === "terms"
            ? "text-white border-brand-100"
            : "text-base-800 border-transparent hover:text-white",
        )}
      >
        Terms & Conditions
      </button>
      {showDeliverables && (
        <button
          onClick={() => onTabChange("deliverables")}
          className={cn(
            `cursor-pointer pb-3 text-sm font-medium transition-colors border-b-2
            -mb-px`,
            activeTab === "deliverables"
              ? "text-white border-brand-100"
              : "text-base-800 border-transparent hover:text-white",
          )}
        >
          My Submission
        </button>
      )}
    </div>
  );
}

export type { TabType };
