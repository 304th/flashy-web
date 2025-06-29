'use client';

import {PropsWithChildren, ReactNode, useState} from "react";
import { HouseIcon, TvIcon, NotebookIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItemProps {
  route: string;
  icon: ReactNode;
}

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return <div className={`fixed flex justify-center py-6 transition w-[60px] h-screen bg-base-200 z-1`} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
    <div className="flex flex-col w-full items-center gap-2">
      <NavItem route="/" icon={<HouseIcon size={20} />}>
        Home
      </NavItem>
      <NavItem route="/video" icon={<TvIcon size={20} />}>
        Video
      </NavItem>
      <NavItem route="/social" icon={<NotebookIcon size={20} />}>
        Social
      </NavItem>
    </div>
  </div>
}


const NavItem = ({ route, icon, children }: PropsWithChildren<NavItemProps>) => {
  const pathname = usePathname();

  return <Link href={route} className="w-full aspect-square">
    <div className={`flex w-full flex-col items-center justify-center gap-1 cursor aspect-square transition ${pathname === route ? "bg-base-300 text-white" : "hover:bg-base-300"}`}>
      {icon}
      <p className="font-extralight text-sm">
        {children}
      </p>
    </div>
  </Link>
}