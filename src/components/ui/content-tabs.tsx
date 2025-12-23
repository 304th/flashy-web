"use client";

import { cn } from "@/lib/utils";

export interface ContentTabsProps<T extends string> {
  tabs: { value: T; label?: string }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  variant?: "pills" | "underline";
}

export function ContentTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  variant = "pills",
}: ContentTabsProps<T>) {
  if (variant === "underline") {
    return (
      <div className="flex items-center gap-6 border-b border-base-600">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              `cursor-pointer pb-3 text-sm font-medium transition-colors
              border-b-2 -mb-px whitespace-nowrap`,
              activeTab === tab.value
                ? "text-white border-brand-100"
                : "text-base-800 border-transparent hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            `cursor-pointer px-3 py-1.5 font-medium rounded-md transition-colors
            text-lg`,
            activeTab === tab.value
              ? "text-white bg-base-400"
              : "text-base-800 hover:text-white hover:bg-base-300",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
