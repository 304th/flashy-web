import { PlusIcon, MessageCircle, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountDropdown } from "@/features/auth/components/account-login/account-dropdown";

export const LoggedIn = () => {
  return <div className="flex items-center gap-4">
    <div className="relative top-[1px] flex items-center gap-2">
      <Button className="!w-fit p-0 aspect-square" size="sm">
        <PlusIcon />
      </Button>
      <Button className="!w-fit p-0 aspect-square" size="sm" variant="secondary">
        <MessageCircle />
      </Button>
      <Button className="!w-fit p-0 aspect-square" size="sm" variant="secondary">
        <BellIcon />
      </Button>
    </div>
    <AccountDropdown />
  </div>
}