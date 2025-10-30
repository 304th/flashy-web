import type { ReactNode } from "react";
import { MessagesSidebar } from "@/features/messaging/components/messages-sidebar/messages-sidebar";

export default function MessagesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative flex gap-4 w-full">
      <div className="w-2/6">
        <MessagesSidebar />
      </div>
      <div className="w-4/6">
        {children}
      </div>
    </div>
  );
}
