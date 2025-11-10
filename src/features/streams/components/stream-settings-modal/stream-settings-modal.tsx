import config from "@/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUpdateStream } from "@/features/streams/mutations/use-update-stream";

export interface StreamSettingsModalProps {
  stream: Stream;
  onClose(): void;
}

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(
      config.content.videos.title.maxLength,
      `Title must be at most ${config.content.videos.title.maxLength} characters`,
    ),
  description: z
    .string()
    .max(
      config.content.videos.description.maxLength,
      `Description must be at most ${config.content.videos.description.maxLength} characters`,
    )
    .optional(),
  scheduledAt: z.string().optional(),
  chatEnabled: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export const StreamSettingsModal = ({
  stream,
  onClose,
}: StreamSettingsModalProps) => {
  const updateStream = useUpdateStream();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: stream.title,
      description: stream.description || "",
      scheduledAt: stream.scheduledAt || "",
      chatEnabled: stream.chatEnabled,
    },
    mode: "all",
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await updateStream.mutateAsync({
        streamId: stream._id,
        ...data,
        description: data.description || "",
      });
      onClose();
    } catch (error) {
      console.error("Failed to update stream:", error);
    }
  };

  return (
    <ModalComponent onClose={onClose}>
      <div className="relative w-full max-w-2xl rounded-lg bg-background p-6">
        <CloseButton onClick={onClose} />

        <h2 className="mb-6 text-2xl font-bold">Stream Settings</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your stream title..."
                      {...field}
                      disabled={updateStream.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your stream..."
                      rows={4}
                      {...field}
                      disabled={updateStream.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Time (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={updateStream.isPending || stream.isLive}
                    />
                  </FormControl>
                  <FormMessage />
                  {stream.isLive && (
                    <p className="text-sm text-muted-foreground">
                      Cannot change schedule while stream is live
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chatEnabled"
              render={({ field }) => (
                <FormItem
                  className="flex flex-row items-center justify-between
                    rounded-lg border p-4"
                >
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Chat</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Allow viewers to chat during your stream
                    </p>
                  </div>
                  <FormControl>
                    <Switch.Root
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={updateStream.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateStream.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateStream.isPending}>
                {updateStream.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ModalComponent>
  );
};
