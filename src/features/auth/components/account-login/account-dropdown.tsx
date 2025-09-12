import { useState } from "react";
import {
  UserIcon,
  VideoIcon,
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
import { useMe } from "@/features/auth/queries/use-me";
import { useLogout } from "@/features/auth/queries/use-logout";
import { UserAvatar } from "@/components/ui/user-avatar";

export const AccountDropdown = () => {
  const [me] = useMe();
  const [open, setOpen] = useState(false);
  const logout = useLogout();

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[60px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild>
          <UserAvatar
            avatar={me?.userimage}
            onMouseEnter={() => setOpen(true)}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[320px] bg-base-300 border-base-400"
          align="end"
        >
          <div
            className="flex p-3 h-[80px] bg-base-300
              inset-shadow-[0_0_4px_0_rgba(0,0,0,0.1)] inset-shadow-base-200
              rounded mb-1"
          >
            <div
              className="flex items-center gap-2 whitespace-nowrap
                overflow-hidden text-ellipsis w-full"
            >
              <UserAvatar avatar={me?.userimage} />
              <p className="text-white font-extrabold">{me?.username}</p>
            </div>
          </div>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <div className="flex items-center gap-2 p-1">
                <UserIcon />
                <p>Channel</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center gap-2 p-1">
                <VideoIcon />
                <p>My Videos</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center gap-2 p-1">
                <WalletIcon />
                <p>My Wallet</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex items-center gap-2 p-1">
              <SettingsIcon />
              Settings
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              logout.mutate(undefined, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            <div className="flex items-center gap-2 p-1">
              <LogOutIcon />
              Log out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="absolute w-[80px] h-6 right-0" />
    </div>
  );
};
