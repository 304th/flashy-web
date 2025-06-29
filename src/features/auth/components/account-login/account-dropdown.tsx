import { useState } from "react";
import { UserIcon, VideoIcon, WalletIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMe } from "@/features/auth/queries/useMe";
import { useLogout } from "@/features/auth/queries/useLogout";
import {UserAvatar} from "@/components/ui/user-avatar";

export const AccountDropdown = () => {
  const [me] = useMe();
  const [open, setOpen] = useState(false);
  const logout = useLogout()

  return <div className="relative" onMouseLeave={() => setOpen(false)}>
    <DropdownMenu modal={false} open={open}>
      <DropdownMenuTrigger asChild onMouseEnter={() => setOpen(true)}>
        <Avatar className="cursor-pointer">
          <AvatarImage src={me?.avatar} alt="avatar" />
          <AvatarFallback>
            <AvatarImage src="/images/avatar.svg" alt="defaultAvatar" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] bg-base-300 border-base-400" align="end">
        <div className="flex p-3 h-[80px] bg-gradient-to-b from-base-100 to-base-300 rounded-t">
          <div className="flex items-center gap-2">
            <UserAvatar avatar={me?.avatar} />
            <p className="text-white font-extrabold">{me?.name}</p>
          </div>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="flex items-center gap-2">
              <UserIcon />
              Channel
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center gap-2">
              <VideoIcon />
              My Videos
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center gap-2">
              <WalletIcon />
              My Wallet
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div className="flex items-center gap-2">
            <SettingsIcon />
            Settings
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout.mutate({
          onSuccess: () => setOpen(false),
        })}>
          <div className="flex items-center gap-2">
            <LogOutIcon />
            Log out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div className="absolute w-[80px] h-6 right-0" />
  </div>
}