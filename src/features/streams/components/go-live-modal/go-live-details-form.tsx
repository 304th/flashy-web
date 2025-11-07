import config from "@/config";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProfileStream } from "@/features/profile/queries/use-profile-stream";
import { useUpdateStream } from "@/features/streams/mutations/use-update-stream";

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
  streamKey: z.string().optional(),
  rtmpUrl: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const GoLiveDetailsForm = ({ onClose }: { onClose: () => void; }) => {
  const { data: stream, query } = useProfileStream();
  const updateStream = useUpdateStream();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      chatEnabled: true,
      streamKey: "",
      rtmpUrl: "",
    },
    mode: "all",
  });

  // Populate form with existing stream data when available
  useEffect(() => {
    if (stream) {
      form.reset({
        title: stream.title || "",
        description: stream.description || "",
        chatEnabled: stream.chatEnabled ?? true,
        scheduledAt: stream.scheduledAt || "",
        streamKey: stream.streamKey || "",
        rtmpUrl: stream.rtmpUrl || "",
      });
    }
  }, [stream, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(async (params) => {
        if (!stream) {
          return;
        }

        updateStream.mutate({
          streamId: stream._id,
          title: params.title,
          description: params.description || "",
          chatEnabled: params.chatEnabled,
          scheduledAt: params.scheduledAt || undefined,
        });

        onClose();
      })} className="flex flex-col p-4 gap-4">
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*<FormField*/}
        {/*  control={form.control}*/}
        {/*  name="scheduledAt"*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem>*/}
        {/*      <FormLabel>Schedule Stream (Optional)</FormLabel>*/}
        {/*      <FormControl>*/}
        {/*        <Input*/}
        {/*          type="datetime-local"*/}
        {/*          {...field}*/}
        {/*          disabled={isSubmitting}*/}
        {/*        />*/}
        {/*      </FormControl>*/}
        {/*      <FormMessage />*/}
        {/*      <p className="text-sm text-muted-foreground">*/}
        {/*        Leave empty to create stream for immediate use*/}
        {/*      </p>*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}
        <FormField
          control={form.control}
          name="chatEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateStream.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isValid || !form.formState.isDirty || updateStream.isPending || !stream}
            className="min-w-[120px]"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
