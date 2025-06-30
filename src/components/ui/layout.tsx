import { ReactNode } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="relative">
        <Sidebar />
        <div className="flex flex-col p-4 ml-[60px]">{children}</div>
      </div>
    </>
  );
};
