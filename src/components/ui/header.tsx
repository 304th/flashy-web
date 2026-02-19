"use client";

// import { useEffect, useRef } from "react";
import Link from "next/link";
import { AccountLogin } from "@/features/auth/components/account-login/account-login";
import { HeaderUserSearch } from "@/components/ui/header-user-search";
import { HamburgerIcon } from "@/components/ui/icons/hamburger";
import { CreateDropdown } from "@/features/auth/components/account-login/create-dropdown";
import { useSidebar } from "@/contexts/sidebar-context";
import { useMe } from "@/features/auth/queries/use-me";
// import { useTrackLogin } from "@/features/gamification/mutations/use-track-login";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { data: me } = useMe();
  // const trackLoginMutation = useTrackLogin();
  // const hasTrackedLogin = useRef(false);

  // useEffect(() => {
  //   if (me && !hasTrackedLogin.current) {
  //     hasTrackedLogin.current = true;
  //     trackLoginMutation.mutate();
  //   }
  // }, [me]);

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
            className="inline-flex items-center p-2 transition hover:bg-base-300
              gap-2"
          >
            <img src="/logo-new.svg" alt="Logo" height={20} width={200} />
            <span
              className="relative -top-2 text-sm font-bold text-yellow-400 px-2
                py-0.5 rounded border border-yellow-400/50 bg-yellow-400/10"
            >
              Beta
            </span>
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
