import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { VideoCreateSubmitButton } from "@/features/video/components/video-create-modal/video-create-submit-button";

export const VideoFormDetails = ({ onClose }: { onClose: () => void }) => {
  const form = useFormContext();
  const title = form.watch("title");

  return (
    <div
      className="flex flex-col w-[75vw] max-w-[800px] max-h-[75vh] aspect-video
        mx-auto"
    >
      <div className="flex w-full grow divide-x">
        <div className="flex flex-col w-3/5 p-4 gap-4">
          <FormField
            name="title"
            render={(props) => (
              <FormItem className="w-full">
                <FormLabel>Video Title</FormLabel>
                <FormControl>
                  <Input placeholder="Name your video..." {...props.field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            render={(props) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <Textarea
                  maxLength={500}
                  placeholder="Add a description..."
                  className="rounded-md w-full min-h-[100px]"
                  {...props.field}
                />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col w-2/5 p-4 gap-4">
          <ImageUpload
            title="Upload Thumbnail"
            className="w-full"
            onChange={async (file) => {
              form.setValue("thumbnailUpload", file, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
          <p className="text-lg text-white font-medium ellipsis">{title}</p>
        </div>
      </div>
      <div className="flex w-full p-4 gap-2 justify-end items-center">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <VideoCreateSubmitButton />
      </div>
    </div>
  );
};
