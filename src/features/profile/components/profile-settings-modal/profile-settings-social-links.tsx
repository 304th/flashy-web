import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const ProfileSettingsSocialLinks = () => {
  return (
    <div
      className="flex flex-col gap-3 p-4 w-full grow items-center max-h-[500px]
        overflow-scroll"
    >
      <FormField
        name="links.x"
        render={(props) => (
          <FormItem className="w-full">
            <FormLabel>X</FormLabel>
            <FormControl>
              <Input placeholder="https://x.com" {...props.field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="links.youtube"
        render={(props) => (
          <FormItem className="w-full">
            <FormLabel>Youtube</FormLabel>
            <FormControl>
              <Input placeholder="https://youtube.com" {...props.field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="links.instagram"
        render={(props) => (
          <FormItem className="w-full">
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input placeholder="https://instagram.com" {...props.field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="links.linkedin"
        render={(props) => (
          <FormItem className="w-full">
            <FormLabel>LinkedIn</FormLabel>
            <FormControl>
              <Input placeholder="https://linkedin.com" {...props.field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="links.website"
        render={(props) => (
          <FormItem className="w-full">
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input placeholder="https://your-website.com" {...props.field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
