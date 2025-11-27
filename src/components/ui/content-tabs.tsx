"use client";

import { cn } from "@/lib/utils";

export interface ContentTabsProps<T extends string> {
  tabs: { value: T; label?: string }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export function ContentTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: ContentTabsProps<T>) {
  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            `cursor-pointer px-3 py-1.5 font-medium rounded-md
            transition-colors text-lg`,
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