"use client";

import Link from "next/link";
import { AccountLogin } from "@/features/auth/components/account-login/account-login";
import { HeaderUserSearch } from "@/components/ui/header-user-search";
import { HamburgerIcon } from "@/components/ui/icons/hamburger";
import { useSidebar } from "@/contexts/sidebar-context";
import { useNotifications } from "@/features/notifications/queries/use-notifications";

export const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="relative bg-base-200 border-b border-b-base-300 z-3">
      <div
        className="flex bg-base-200 border-b border-b-base-300 w-full px-4 py-0
          h-16 items-center justify-between max-w-content"
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-between p-3 text-white
              cursor-pointer hover:bg-base-300 rounded"
            role="button"
            onClick={toggleSidebar}
          >
            <HamburgerIcon />
          </div>
          <Link
            href="/"
            className="inline-flex items-center p-2 rounded transition
              hover:bg-base-300"
          >
            <img src="/logo.svg" alt="Logo" height={36} width={90} />
            <img
              src="/app.svg"
              alt="App"
              height={36}
              width={90}
              className="relative scale-90 top-[1px]"
            />
          </Link>
        </div>
        <div className="flex-1 mx-6 hidden md:flex justify-center">
          <HeaderUserSearch />
        </div>
        <AccountLogin />
      </div>
    </div>
  );
};
