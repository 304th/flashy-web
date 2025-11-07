import { ReactNode } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="relative max-w-content z-0">
        <Sidebar />
        <div className="flex flex-col p-4 ml-[70px]">{children}</div>
      </div>
    </>
  );
};
