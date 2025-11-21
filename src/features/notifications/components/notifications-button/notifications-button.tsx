import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationsCount } from "@/features/notifications/queries/use-notifications-count";
import { NotificationsDropdown } from "@/features/notifications/components/notifications-dropdown/notifications-dropdown";

export const NotificationsButton = () => {
  const { data: notificationsCount } = useNotificationsCount();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[35px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Button
              className="!w-fit p-0 aspect-square"
              size="sm"
              variant="secondary"
              onMouseEnter={() => setOpen(true)}
            >
              <BellIcon />
            </Button>
            {notificationsCount && notificationsCount?.value > 0 && (
              <div
                className="absolute top-[-15%] right-[-15%] flex items-center
                  justify-center h-4 w-4 bg-orange-500 text-white p-2 rounded-lg pointer-events-none"
              >
                <p className="font-medium text-sm">{notificationsCount?.value}</p>
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[420px] max-h-[600px] overflow-y-auto bg-base-300 border-base-400 p-0 scrollbar-hide"
          align="end"
        >
          <NotificationsDropdown onClose={() => setOpen(false)} />
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="absolute w-[80px] h-6 right-0" />
    </div>
  );
};