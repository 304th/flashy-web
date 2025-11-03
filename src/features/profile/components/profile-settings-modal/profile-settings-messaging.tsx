import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

export const ProfileSettingsMessaging = () => {
  return (
    <div
      className="flex flex-col gap-3 p-4 w-full grow items-center max-h-[500px]
        overflow-scroll"
    >
      <FormField
        name="receivesMessagesFromAnyone"
        render={(props) => (
          <FormItem
            className="w-full flex flex-row items-center justify-between"
          >
            <div className="flex flex-col">
              <FormLabel>Receive Messages from Anyone</FormLabel>
              <p className="text-sm text-base-800 mt-1">
                Allow anyone to send you messages, even if you don't follow them
              </p>
            </div>
            <FormControl>
              <Switch.Root
                checked={props.field.value || false}
                onCheckedChange={props.field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};




