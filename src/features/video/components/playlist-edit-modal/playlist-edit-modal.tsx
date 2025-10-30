import config from "@/config";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";
import { useUpdatePlaylist } from "@/features/video/mutations/use-update-playlist";
import { PlaylistEditFormDetails } from "./playlist-edit-form-details";

export interface PlaylistEditModalProps {
  playlist: Playlist;
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
  thumbnailUpload: z.instanceof(File).optional(),
  description: z
    .string()
    .max(config.content.videos.description.maxLength)
    .optional(),
});

export const PlaylistEditModal = ({
  playlist,
  onClose,
  ...props
}: PlaylistEditModalProps) => {
  const updatePlaylist = useUpdatePlaylist();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: playlist.title,
      description: playlist.description || "",
    },
    mode: "all",
  });

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col rounded-md"
      >
        <div className="flex w-full p-4">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Edit playlist</p>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (params) => {
              let thumbnail = playlist.image; // Use existing thumbnail as default

              // Only upload new thumbnail if a file was selected
              if (params.thumbnailUpload) {
                const { uploadUrl, fileType } =
                  await createSignedUploadUrlMutation.write({
                    fileName: params.thumbnailUpload.name,
                    fileType: params.thumbnailUpload.type,
                  });

                thumbnail = await uploadImage.write({
                  file: params.thumbnailUpload,
                  type: fileType,
                  uploadUrl: uploadUrl,
                });
              }

              await updatePlaylist.mutateAsync({
                playlistId: playlist._id,
                title: params.title,
                description: params.description,
                thumbnail,
              });

              onClose();
            })}
          >
            <PlaylistEditFormDetails playlist={playlist} onClose={onClose} />
          </form>
        </Form>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset !bg-base-300 !rounded-md max-sm:w-full
      shadow-2xl overflow-hidden ${props.className}`}
  />
);





