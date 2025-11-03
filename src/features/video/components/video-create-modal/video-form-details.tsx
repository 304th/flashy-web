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
import { Select } from "@/components/ui/select";
import { useProfilePlaylists } from "@/features/profile/queries/use-profile-playlists";

const CATEGORIES = [
  { value: "action", label: "Action" },
  { value: "fantasy", label: "Fantasy" },
  { value: "funny", label: "Funny" },
  { value: "horror", label: "Horror" },
  { value: "romantic", label: "Romantic" },
  { value: "drama", label: "Drama" },
  { value: "scifi", label: "Scifi" },
  { value: "games", label: "Games" },
  { value: "poetry", label: "Poetry" },
  { value: "music", label: "Music" },
];

export const VideoFormDetails = ({ onClose }: { onClose: () => void }) => {
  const form = useFormContext();
  const title = form.watch("title");
  const { data: playlists } = useProfilePlaylists();

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
          <FormField
            name="category"
            render={(props) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select.Root
                    value={props.field.value}
                    onValueChange={props.field.onChange}
                    placeholder="Select a category"
                  >
                    {CATEGORIES.map((c) => (
                      <Select.Item key={c.value} value={c.value}>
                        {c.label}
                      </Select.Item>
                    ))}
                  </Select.Root>
                </FormControl>
                <FormMessage />
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
          <FormField
            name="playlistId"
            render={(props) => (
              <FormItem className="w-full">
                <FormLabel>Playlist</FormLabel>
                <FormControl>
                  <Select.Root
                    value={props.field.value}
                    onValueChange={props.field.onChange}
                    placeholder="Select a playlist (optional)"
                  >
                    {(playlists || []).map((pl) => (
                      <Select.Item key={pl.fbId} value={pl.fbId}>
                        {pl.title}
                      </Select.Item>
                    ))}
                  </Select.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
