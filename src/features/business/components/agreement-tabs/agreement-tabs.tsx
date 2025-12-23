"use client";

import { cn } from "@/lib/utils";

export type AgreementTabType = "deliverables" | "description" | "terms";

interface AgreementTabsProps {
  activeTab: AgreementTabType;
  onTabChange: (tab: AgreementTabType) => void;
}

const tabs: { id: AgreementTabType; label: string }[] = [
  { id: "deliverables", label: "Deliverables" },
  { id: "description", label: "Description" },
  { id: "terms", label: "Terms & Conditions" },
];

export function AgreementTabs({ activeTab, onTabChange }: AgreementTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-base-600">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            `cursor-pointer pb-3 text-sm font-medium transition-colors
            border-b-2 -mb-px whitespace-nowrap`,
            activeTab === tab.id
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
