import { useState } from "react";
import Link from "next/link";
import {
  UserIcon,
  VideoIcon,
  PlayIcon,
  WalletIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMe } from "@/features/auth/queries/use-me";
import { useLogout } from "@/features/auth/queries/use-logout";
import { usePathnameChangedEffect } from "@/hooks/use-pathname-changed-effect";
import { useModals } from "@/hooks/use-modals";
import { UserProfile } from "@/components/ui/user-profile";
import { ChannelIcon } from "@/components/ui/icons/channel";
import { ChannelVideosIcon } from "@/components/ui/icons/channel-videos";
import { ChannelWalletIcon } from "@/components/ui/icons/channel-wallet";
import { ChannelSettingsIcon } from "@/components/ui/icons/channel-settings";
import {ChannelLogoutIcon} from "@/components/ui/icons/channel-logout";

export const AccountDropdown = () => {
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const logout = useLogout();
  const { openModal } = useModals();

  usePathnameChangedEffect(() => {
    setOpen(false);
  });

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[60px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild>
          <Link href="/profile/social">
            <UserAvatar
              avatar={me?.userimage}
              onMouseEnter={() => setOpen(true)}
            />
          </Link>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[320px] bg-base-300 border-base-400"
          align="end"
        >
          <div
            className="flex p-3 h-[80px] bg-base-300 bg-cover
              inset-shadow-[0_0_4px_0_rgba(0,0,0,0.1)] inset-shadow-base-200
              rounded mb-1"
            style={{
              backgroundImage: `url('${me?.banner ? me?.banner : "/images/channel-placeholder.png"}')`,
            }}
          >
            <UserProfile
              user={me!}
              truncateUsername
              className="w-full flex backdrop-blur-xs items-center"
            />
          </div>
          <DropdownMenuGroup>
            <Link href="/profile/social">
              <DropdownMenuItem className="[&_svg:not([class*='size-'])]:size-6">
                <div className="flex items-center gap-2 p-1">
                  <ChannelIcon />
                  <p className="text-white">Channel</p>
                </div>
              </DropdownMenuItem>
            </Link>
            <Link href="/profile/video">
              <DropdownMenuItem className="[&_svg:not([class*='size-'])]:size-6">
                <div className="flex items-center gap-2 p-1">
                  <ChannelVideosIcon />
                  <p className="text-white">My Videos</p>
                </div>
              </DropdownMenuItem>
            </Link>
            {/*<Link href="/profile/playlists">*/}
            {/*  <DropdownMenuItem>*/}
            {/*    <div className="flex items-center gap-2 p-1">*/}
            {/*      <PlayIcon />*/}
            {/*      <p>My Playlists</p>*/}
            {/*    </div>*/}
            {/*  </DropdownMenuItem>*/}
            {/*</Link>*/}
            <Link href="/profile/wallet">
              <DropdownMenuItem className="[&_svg:not([class*='size-'])]:size-6">
                <div className="flex items-center gap-2 p-1">
                  <ChannelWalletIcon />
                  <p className="text-white">My Wallet</p>
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openModal("ProfileSettingsModal");
              setOpen(false);
            }}
            className="[&_svg:not([class*='size-'])]:size-6"
          >
            <div className="flex items-center gap-2 p-1">
              <ChannelSettingsIcon />
              <p className="text-white">Settings</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              logout.mutate(undefined, {
                onSuccess: () => setOpen(false),
              })
            }
            className="[&_svg:not([class*='size-'])]:size-6"
          >
            <div className="flex items-center gap-2 p-1">
              <ChannelLogoutIcon />
              <p className='text-white'>Log out</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="absolute w-[80px] h-6 right-0" />
    </div>
  );
};
