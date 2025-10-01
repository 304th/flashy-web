import { ImageUpload } from "@/components/ui/image-upload";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const ProfileSettingsProfile = () => {
  return (
    <div
      className="flex flex-col gap-3 p-4 w-full grow items-center h-full
        overflow-scroll disable-scroll-bar"
    >
      <ImageUpload
        title="Upload Banner"
        initialPreview="/images/channel-placeholder.png"
        className="w-full"
        onChange={() => {}}
      />
      <ImageUpload
        title="Upload Avatar"
        initialPreview="/images/channel-placeholder.png"
        className="rounded-full aspect-square w-fit"
        onChange={() => {}}
      />
      <FormField
        name="username"
        render={(props) => (
          <FormItem className="w-full">
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Your username..." {...props.field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="bio"
        render={(props) => (
          <FormItem className="w-full">
            <FormLabel>Bio</FormLabel>
            <Textarea
              maxLength={500}
              placeholder="Your bio..."
              className="rounded-md w-full min-h-[100px]"
              {...props.field}
            />
          </FormItem>
        )}
      />
    </div>
  );
};
