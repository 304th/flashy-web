import {Button} from "@/components/ui/button";
import {BellIcon} from "lucide-react";
import {useNotificationsCount} from "@/features/notifications/queries/use-notifications-count";

export const NotificationsButton = () => {
  const [notificationsCount] = useNotificationsCount();

  return (
    <div className="relative">
      <Button
        className="!w-fit p-0 aspect-square"
        size="sm"
        variant="secondary"
      >
        <BellIcon />
      </Button>
      {notificationsCount && notificationsCount > 0 && (
        <div
          className="absolute top-[-15%] right-[-15%] flex items-center
            justify-center h-4 w-4 bg-orange-500 text-white p-2 rounded-lg"
        >
          <p className="font-medium text-sm">{notificationsCount}</p>
        </div>
      )}
    </div>
  )
}