"use client";

import Link from "next/link";
import { AccountLogin } from "@/features/auth/components/account-login/account-login";
import { HeaderUserSearch } from "@/components/ui/header-user-search";
import { HamburgerIcon } from "@/components/ui/icons/hamburger";
import { CreateDropdown } from "@/features/auth/components/account-login/create-dropdown";
import { useSidebar } from "@/contexts/sidebar-context";

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
            className="inline-flex items-center p-2 transition
              hover:bg-base-300"
          >
            <img src="/logo.svg" alt="Logo" height={20} width={200} />
          </Link>
        </div>
        <div
          className="flex-1 gap-2 items-center mx-6 hidden md:flex
            justify-center"
        >
          <HeaderUserSearch />
          <CreateDropdown />
        </div>
        <AccountLogin />
      </div>
    </div>
  );
};
