"use client";

import { TabMenu } from "@/components/ui/tabs/tabs";

export const ProfileVideoTabs = ({
  currentTab,
  tabs,
  onTabChange,
}: {
  currentTab: string;
  tabs: { key: string; label: string }[];
  onTabChange: (newTab: string) => void;
}) => {
  return (
    <TabMenu.Root
      defaultValue={currentTab}
      className={`border p-1 rounded-[100px] w-fit bg-base-200 overflow-hidden
        transition
        ${currentTab === "published" ? "border-brand-200" : "border-orange-500 "}`}
    >
      <TabMenu.List className="gap-1 h-10 overflow-hidden">
        {tabs.map(({ key, label }) => (
          <TabMenu.Trigger
            key={key}
            value={key}
            className={`cursor-pointer z-1 hover:text-white w-full h-full
            transition px-4 flex items-center rounded-full
            ${key === currentTab && currentTab === "published" ? "bg-green-950" : key === currentTab && currentTab === "draft" ? "bg-orange-900" : ""}`}
            onClick={() => onTabChange(key)}
          >
            {label}
          </TabMenu.Trigger>
        ))}
      </TabMenu.List>
    </TabMenu.Root>
  );
};
