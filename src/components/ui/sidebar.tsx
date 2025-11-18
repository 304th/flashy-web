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
import { useSidebar } from "@/contexts/sidebar-context";
import {Tag} from "@/components/ui/tag";
import {useProfileFollowings} from "@/features/profile/queries/use-profile-followings";
import {Loadable} from "@/components/ui/loadable";
import {UserProfile} from "@/components/ui/user-profile";
import {NotFound} from "@/components/ui/not-found";
import {useMe} from "@/features/auth/queries/use-me";
import {Spinner} from "@/components/ui/spinner/spinner";

interface NavItemProps {
  route: string;
  icon: ReactNode;
  className?: string;
  expanded: boolean;
  disabled?: boolean;
}

export const Sidebar = () => {
  const { expanded } = useSidebar();

  return (
    <div
      className={`flex flex-col justify-start gap-2 py-4 h-full
        bg-base-200 border-r border-r-base-300 ${
          expanded ? "w-[240px]" : "w-[82px]"
        }`}
    >
      <div className="flex flex-col w-full items-center gap-2">
        <NavItem route="/" icon={<HomeIcon />} className="text-xs" expanded={expanded}>
          Home
        </NavItem>
        <NavItem route="/video" icon={<PlayIcon />} className="text-xs" expanded={expanded}>
          Video
        </NavItem>
        <NavItem route="/stream" icon={<StreamsIcon />} className="text-xs" expanded={expanded}>
          Streams
        </NavItem>
        <NavItem route="/social" icon={<SocialIcon />} className="text-xs" expanded={expanded}>
          Social
        </NavItem>
      </div>
      {
        expanded && (
          <>
            <Separator />
            <div className="flex flex-col w-full items-center gap-2">
              <NavItem route="/" icon={<MonetiseIcon />} className="text-xs" expanded={expanded} disabled>
                <Tag>COMING SOON</Tag>
              </NavItem>
            </div>
            <Separator />
            <Subscriptions />
            <Separator />
          </>
        )
      }
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
}: PropsWithChildren<NavItemProps>) => {
  const pathname = usePathname();

  return (
    <Link aria-disabled={disabled} href={!disabled ? route : ''} className={`w-full ${expanded ? "" : ""} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}>
      <div
        className={`w-full transition cursor ${
            expanded
              ? "grid grid-cols-[40px_1fr] items-center gap-3 px-4 h-[44px]"
              : "flex flex-col items-center justify-center gap-2 p-4 h-[60px]"
          } ${
            pathname === route
              ? "bg-base-300 text-white"
              : "hover:bg-base-300"
          }`}
      >
        <div className="flex items-center justify-center">{icon}</div>
        <span className={expanded ? "text-sm font-medium whitespace-nowrap" : "text-xs"}>{children}</span>
      </div>
    </Link>
  );
};

const Subscriptions = () => {
  const { data: me, query: meQuery } = useMe()
  const { data: subscriptions, query: subsQuery } = useProfileFollowings();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return <div className="flex w-full flex-col gap-2">
    <div
      className="flex items-center justify-between !h-[40px] px-4 cursor-pointer transition hover:bg-base-300"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <p>Subscriptions</p>
      <div className={`transition-transform ${isCollapsed ? '' : 'rotate-180'}`}>
        <ChevronDownIcon />
      </div>
    </div>
    {!isCollapsed && (
      <div className="flex w-full justify-center max-h-[200px] overflow-y-auto">
        <Loadable queries={[meQuery, subsQuery] as any} fallback={<div className="flex items-center justify-center w-full p-4"><Spinner /></div>}>
          {() => {
            return subscriptions && subscriptions?.length > 0 && me ? subscriptions.map(subscription => (
              <UserProfile key={subscription.fbId} user={subscription} className="w-full py-2 px-4 rounded-none hover:bg-base-300" />
            )) : <NotFound>No subscriptions yet</NotFound>
          }}
        </Loadable>
      </div>
    )}
  </div>
}