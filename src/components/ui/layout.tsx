import { type ReactNode } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileBlockingBanner } from "@/components/ui/mobile-blocking-banner";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MobileBlockingBanner />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div
          id="container"
          className="flex-1 flex flex-col p-4 overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
