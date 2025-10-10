import config from '@/config'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {ImageUpload} from "@/components/ui/image-upload";
import {Button} from "@/components/ui/button";
import React from "react";

const formSchema = z.object({
  videoId: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters").max(config.content.videos.title.maxLength, `Title must be at most ${config.content.videos.title.maxLength} characters`),
  thumbnailUpload: z.instanceof(File),
  description: z.string().max(config.content.videos.description.maxLength).optional(),
});

export const VideoForm = ({ videoId }: { videoId: string }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoId,
      title: '',
      description: '',
    },
    mode: "all",
  });

  const title = form.watch('title');

  return <Form {...form}>
    <form onSubmit={form.handleSubmit(async (params) => {

    })} className="flex flex-col w-[75vw] max-w-[800px] max-h-[75vh] aspect-video mx-auto">
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
              if (file) {
                form.setValue("thumbnailUpload", file, { shouldDirty: true });
              }
            }}
          />
          <p className="text-lg text-white font-medium">{title}</p>
        </div>
      </div>
      <div className="flex w-full p-4 gap-4 justify-end">
        <Button
          disabled={form.formState.isValid}
          className="max-w-[100px]"
          type="submit"
        >
          Publish
        </Button>
      </div>
    </form>
  </Form>
}