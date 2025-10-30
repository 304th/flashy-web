"use client";

import { MessagesIcon } from "@/components/ui/icons/messages";

export default function MessagesPage() {
  return (
    <div className="relative flex justify-center items-center h-full">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col text-center">
          <p className="text-white text-lg font-medium">Select a chat</p>
          <p className="text-sm">Choose a chat on the panel to the left</p>
        </div>
        <MessagesIcon />
      </div>
    </div>
  );
}
