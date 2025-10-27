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
import {useCreatePlaylist} from "@/features/video/mutations/use-create-playlist";
import {PlaylistFormDetails} from "@/features/video/components/playlist-create-modal/playlist-form-details";

export interface PlaylistCreateModalProps {
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
  thumbnailUpload: z.instanceof(File),
  description: z
    .string()
    .max(config.content.videos.description.maxLength)
    .optional(),
});

export const PlaylistCreateModal = ({
  onClose,
  ...props
}: PlaylistCreateModalProps) => {
  const createPlaylist = useCreatePlaylist();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
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
          <div
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Create playlist</p>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (params) => {
              const { uploadUrl, fileType } =
                await createSignedUploadUrlMutation.write({
                  fileName: params.thumbnailUpload.name,
                  fileType: params.thumbnailUpload.type,
                });

              const thumbnail = await uploadImage.write({
                file: params.thumbnailUpload,
                type: fileType,
                uploadUrl: uploadUrl,
              });

              await createPlaylist.mutateAsync({
                title: params.title,
                description: params.description,
                thumbnail,
              });

              onClose();
            })}
          >
            <PlaylistFormDetails onClose={onClose} />
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
