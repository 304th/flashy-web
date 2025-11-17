import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal as ModalComponent } from "@/packages/modals";
import { Form } from "@/components/ui/form";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Select } from "@/components/ui/select";
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";
import { useProfilePlaylists } from "@/features/profile/queries/use-profile-playlists";
import { useUpdateVideoPost } from "@/features/video/mutations/use-update-video-post";

export interface VideoEditModalProps {
  video: VideoPost;
  onClose(): void;
}

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

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().max(500).optional(),
  thumbnail: z.string().optional().nullable(),
  thumbnailUpload: z.instanceof(File).optional(),
  category: z.string().optional(),
  series: z.string().optional(),
});

export const VideoEditModal = ({
  video,
  onClose,
  ...props
}: VideoEditModalProps) => {
  const [updateType, setUpdateType] = useState<'published' | 'draft' | null>(null);
  const updateVideo = useUpdateVideoPost();
  const { data: playlists } = useProfilePlaylists();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: video.title || "",
      description: video.description || "",
      thumbnail: video.storyImage,
      category: (video as any).category,
      series: (video as any).playlist?.fbId,
    },
    mode: "all",
  });

  const isPublished = Boolean(
    video.statusweb
      ? video.statusweb === "published"
      : video.publishDate,
  );

  const thumbnailUrl = form.watch("thumbnail");

  const handleThumbnailUpload = async (params: z.infer<typeof formSchema>) => {
    if (params.thumbnailUpload) {
      const { uploadUrl, fileType } = await createSignedUploadUrlMutation.write(
        {
          fileName: params.thumbnailUpload.name,
          fileType: params.thumbnailUpload.type,
        },
      );

      return await uploadImage.write({
        file: params.thumbnailUpload,
        type: fileType,
        uploadUrl,
      });
    } else if (params.thumbnail === null) {
      return "";
    }

    return undefined;
  };

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <div className="relative flex flex-col rounded-md">
        <div className="flex w-full p-4">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Edit Video</p>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (params) => {
              const thumbnail = await handleThumbnailUpload(params);

              await updateVideo.mutateAsync({
                key: video.fbId,
                title: params.title,
                description: params.description,
                thumbnail,
                category: params.category,
                series: params.series,
              });

              onClose();
            })}
          >
            <div className="flex flex-col w-full max-h-[75vh] aspect-video">
              <div className="flex w-full grow divide-x">
                <div className="flex flex-col w-3/5 p-4 gap-4">
                  <FormField
                    name="title"
                    render={(fieldProps) => (
                      <FormItem className="w-full">
                        <FormLabel>Video Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Name your video..."
                            {...fieldProps.field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="description"
                    render={(fieldProps) => (
                      <FormItem className="w-full">
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          maxLength={500}
                          placeholder="Add a description..."
                          className="rounded-md w-full min-h-[100px]"
                          {...fieldProps.field}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="category"
                    render={(fieldProps) => (
                      <FormItem className="w-full">
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select.Root
                            value={fieldProps.field.value}
                            onValueChange={fieldProps.field.onChange}
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
                    initialPreview={thumbnailUrl ?? undefined}
                    className="w-full"
                    onChange={async (file) => {
                      if (file) {
                        form.setValue("thumbnailUpload", file, {
                          shouldDirty: true,
                        });
                      } else {
                        form.setValue("thumbnail", null, {
                          shouldDirty: true,
                        });
                      }
                    }}
                  />
                  <FormField
                    name="series"
                    render={(fieldProps) => (
                      <FormItem className="w-full">
                        <FormLabel>Playlist</FormLabel>
                        <FormControl>
                          <Select.Root
                            value={fieldProps.field.value}
                            onValueChange={fieldProps.field.onChange}
                            placeholder="Select a playlist (optional)"
                          >
                            {!playlists || playlists.length === 0 ? (
                              <Select.Item value="no-playlists" disabled>
                                No playlists
                              </Select.Item>
                            ) : (
                              (playlists || []).map((pl) => (
                                <Select.Item key={pl.fbId} value={pl.fbId}>
                                  {pl.title}
                                </Select.Item>
                              ))
                            )}
                          </Select.Root>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full p-4 gap-2 justify-end items-center">
                <Button variant="secondary" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button
                  disabled={!form.formState.isValid || Boolean(form.formState.isSubmitting && updateType) || !form.formState.isDirty}
                  pending={form.formState.isSubmitting && !updateType}
                  className="w-[100px]"
                  type="submit"
                >
                  Save
                </Button>
                {!isPublished ? (
                  <Button
                    variant="secondary"
                    disabled={!form.formState.isValid}
                    pending={form.formState.isSubmitting && updateType === 'published'}
                    className="w-[110px]"
                    onClick={form.handleSubmit(async (params) => {
                      setUpdateType('published');
                      const thumbnail = await handleThumbnailUpload(params);

                      await updateVideo.mutateAsync({
                        key: video.fbId,
                        title: params.title,
                        description: params.description,
                        thumbnail,
                        category: params.category,
                        series: params.series,
                        statusweb: "published",
                        publishDate: Date.now(),
                      });

                      onClose();
                    })}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    disabled={!form.formState.isValid}
                    pending={form.formState.isSubmitting && updateType === 'draft'}
                    className="w-[110px]"
                    onClick={form.handleSubmit(async (params) => {
                      setUpdateType('draft');
                      const thumbnail = await handleThumbnailUpload(params);

                      await updateVideo.mutateAsync({
                        key: video.fbId,
                        title: params.title,
                        description: params.description,
                        thumbnail,
                        category: params.category,
                        series: params.series,
                        statusweb: "draft",
                      });

                      onClose();
                    })}
                  >
                    Draft
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    portalRootId={"modal-root"}
    animation={{ name: "bottom-sheet", duration: 0.18 }}
    className="w-[90vw] max-w-[860px] bg-base-300 shadow-2xl !p-0"
  />
);
