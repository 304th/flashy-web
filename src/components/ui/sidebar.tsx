"use client";

import { PropsWithChildren, ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@/components/ui/icons/home";
import { PlayIcon } from "@/components/ui/icons/play";
import { SocialIcon } from "@/components/ui/icons/social";
import { StreamsIcon } from "@/components/ui/icons/streams";
import { MonetiseIcon } from "@/components/ui/icons/monetise";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { Separator } from "@/components/ui/separator";
import { StoreIcon } from "@/components/ui/icons/store";
import { useSidebar } from "@/contexts/sidebar-context";
import { useProfileFollowings } from "@/features/profile/queries/use-profile-followings";
import { Loadable } from "@/components/ui/loadable";
import { UserProfile } from "@/components/ui/user-profile";
import { NotFound } from "@/components/ui/not-found";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useModals } from "@/hooks/use-modals";
import { useMe } from "@/features/auth/queries/use-me";
import { useMyBusinessAccount } from "@/features/business";
import { HelpIcon } from "@/components/ui/icons/help";

interface NavItemProps {
  route?: string;
  icon: ReactNode;
  className?: string;
  expanded: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const Sidebar = () => {
  const { expanded } = useSidebar();
  const { openModal } = useModals();
  const { data: businessAccounts } = useMyBusinessAccount();

  return (
    <div
      className={`flex flex-col justify-start gap-2 py-4 h-full bg-base-200
        border-r border-r-base-300 ${expanded ? "w-[240px]" : "w-[82px]"}`}
    >
      <div className="flex flex-col w-full items-center gap-2">
        <NavItem
          route="/"
          icon={<HomeIcon />}
          className="text-xs"
          expanded={expanded}
        >
          Home
        </NavItem>
        <NavItem
          route="/video"
          icon={<PlayIcon />}
          className="text-xs"
          expanded={expanded}
        >
          Video
        </NavItem>
        <NavItem
          route="/stream"
          icon={<StreamsIcon />}
          className="text-xs"
          expanded={expanded}
        >
          Streams
        </NavItem>
        <NavItem
          route="/social"
          icon={<SocialIcon />}
          className="text-xs"
          expanded={expanded}
        >
          Social
        </NavItem>
      </div>
      <Separator />
      {/*<div className="flex flex-col w-full items-center gap-2">*/}
      {/*  <NavItem*/}
      {/*    route="/monetise"*/}
      {/*    icon={<MonetiseIcon />}*/}
      {/*    className="text-xs"*/}
      {/*    expanded={expanded}*/}
      {/*  >*/}
      {/*    Monetise*/}
      {/*  </NavItem>*/}
      {/*  {businessAccounts && (*/}
      {/*    <NavItem*/}
      {/*      route="/business/dashboard"*/}
      {/*      icon={<StoreIcon />}*/}
      {/*      className="text-xs"*/}
      {/*      expanded={expanded}*/}
      {/*      onClick={*/}
      {/*        businessAccounts?.[0]?.status === "approved"*/}
      {/*          ? undefined*/}
      {/*          : () => {*/}
      {/*              openModal("CreateBusinessModal");*/}
      {/*            }*/}
      {/*      }*/}
      {/*    >*/}
      {/*      Business*/}
      {/*    </NavItem>*/}
      {/*  )}*/}
      {/*</div>*/}
      {/*<Separator />*/}
      {expanded && (
        <>
          <Subscriptions />
          <Separator />
        </>
      )}
      <More expanded={expanded} />
    </div>
  );
};

const NavItem = ({
  route,
  icon,
  expanded,
  disabled,
  className,
  children,
  onClick,
}: PropsWithChildren<NavItemProps>) => {
  const pathname = usePathname();

  const NavComponent = ({ onClick }: { onClick?: () => void }) => (
    <div
      role="button"
      className={`w-full transition cursor cursor-pointer ${
        expanded
          ? "grid grid-cols-[40px_1fr] items-center gap-3 px-4 h-[44px]"
          : "flex flex-col items-center justify-center gap-2 p-4 h-[60px]"
        }
        ${pathname === route ? "bg-base-300 text-white" : "hover:bg-base-300"}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span
        className={
          expanded ? "text-sm font-medium whitespace-nowrap" : "text-xs"
        }
      >
        {children}
      </span>
    </div>
  );

  if (onClick) {
    return <NavComponent onClick={onClick} />;
  }

  return (
    <Link
      aria-disabled={disabled}
      href={!disabled ? route || "" : ""}
      className={`w-full ${expanded ? "" : ""}
        ${disabled ? "cursor-not-allowed" : ""} ${className}`}
    >
      <NavComponent />
    </Link>
  );
};

const Subscriptions = () => {
  const { data: me, query: meQuery } = useMe();
  const { data: subscriptions, query: subsQuery } = useProfileFollowings();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        className="flex items-center justify-between !h-[40px] px-4
          cursor-pointer transition hover:bg-base-300"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <p>Subscriptions</p>
        <div
          className={`transition-transform ${isCollapsed ? "" : "rotate-180"}`}
        >
          <ChevronDownIcon />
        </div>
      </div>
      {!isCollapsed && (
        <div
          className="flex flex-col gap-1 w-full justify-center max-h-[200px]
            overflow-y-auto"
        >
          <Loadable
            queries={[meQuery, subsQuery] as any}
            fallback={
              <div className="flex items-center justify-center w-full p-4">
                <Spinner />
              </div>
            }
          >
            {() => {
              return subscriptions && subscriptions?.length > 0 && me ? (
                subscriptions.map((subscription) => (
                  <UserProfile
                    key={subscription.fbId}
                    user={subscription}
                    className="w-full py-2 px-4 rounded-none hover:bg-base-300"
                  />
                ))
              ) : (
                <NotFound>No subscriptions yet</NotFound>
              );
            }}
          </Loadable>
        </div>
      )}
    </div>
  );
};

const More = ({ expanded }: { expanded: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!expanded) {
    return (
      <NavItem route="/about" icon={<HelpIcon />} expanded={expanded}>
        About
      </NavItem>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        className="flex items-center justify-between !h-[40px] px-4
          cursor-pointer transition hover:bg-base-300"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <p>More</p>
        <div
          className={`transition-transform ${isCollapsed ? "" : "rotate-180"}`}
        >
          <ChevronDownIcon />
        </div>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col w-full">
          <NavItem route="/about" icon={<HelpIcon />} expanded={expanded}>
            About
          </NavItem>
        </div>
      )}
    </div>
  );
};
