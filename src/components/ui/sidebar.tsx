"use client";

import { PropsWithChildren, ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@/components/ui/icons/home";
import { PlayIcon } from "@/components/ui/icons/play";
import { SocialIcon } from "@/components/ui/icons/social";
import { StreamsIcon } from "@/components/ui/icons/streams";

interface NavItemProps {
  route: string;
  icon: ReactNode;
  className?: string;
}

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`fixed flex justify-center py-4 transition w-[82px] h-screen
        z-1000 bg-base-200`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col w-full items-center gap-2">
        <NavItem route="/" icon={<HomeIcon />} className="text-xs">
          <p>Home</p>
        </NavItem>
        <NavItem route="/video" icon={<PlayIcon />} className="text-xs">
          <p>Video</p>
        </NavItem>
        <NavItem route="/stream" icon={<StreamsIcon />} className="text-xs">
          <p>Streams</p>
        </NavItem>
        <NavItem route="/social" icon={<SocialIcon />} className="text-xs">
          <p>Social</p>
        </NavItem>
      </div>
    </div>
  );
};

const NavItem = ({
  route,
  icon,
  className,
  children,
}: PropsWithChildren<NavItemProps>) => {
  const pathname = usePathname();

  return (
    <Link href={route} className={`w-full aspect-square ${className}`}>
      <div
        className={`flex w-full flex-col items-center justify-center gap-1
          cursor aspect-square transition rounded ${
            pathname === route
              ? "bg-base-300 text-white"
              : "hover:bg-base-300 hover:scale-110"
          }`}
      >
        {icon}
        {children}
      </div>
    </Link>
  );
};
