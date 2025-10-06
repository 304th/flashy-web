import config from "@/config";
import { Toaster } from "sonner";

export const NotificationsProvider = () => {
  return (
    <div id={config.misc.notificationCenterId} className="absolute">
      <Toaster position="top-center" closeButton richColors />
    </div>
  );
};
