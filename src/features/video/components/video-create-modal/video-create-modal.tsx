import config from "@/config";
import {AnimatePresence, motion} from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { VideoFormUpload } from "@/features/video/components/video-create-modal/video-form-upload";
import {VideoFormDetails} from "@/features/video/components/video-create-modal/video-form-details";
import {useCreateVideoPost} from "@/features/video/mutations/use-create-video-post";
import {createSignedUploadUrlMutation} from "@/features/common/mutations/use-create-signed-upload-url";
import {uploadImage} from "@/features/common/mutations/use-upload-image";
import {useOpenUnsavedVideoChanges} from "@/features/video/hooks/use-open-unsaved-video-changes";

export interface VideoCreateModalProps {
  onClose(): void;
}

const formSchema = z.object({
  videoId: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters").max(config.content.videos.title.maxLength, `Title must be at most ${config.content.videos.title.maxLength} characters`),
  thumbnailUpload: z.instanceof(File),
  description: z.string().max(config.content.videos.description.maxLength).optional(),
});

export const VideoCreateModal = ({
  onClose,
  ...props
}: VideoCreateModalProps) => {
  const createVideoPost = useCreateVideoPost();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
    mode: "all",
  });

  const videoId = form.watch('videoId');
  const openUnsavedChanges = useOpenUnsavedVideoChanges({
    videoId,
    onClose,
  });

  const handleAccidentalClose = () => {
    if (!videoId) {
      return onClose();
    }

    openUnsavedChanges();
  };

  return (
    <Modal onClose={handleAccidentalClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col rounded-md"
      >
        <div className="flex w-full p-4">
          <div className="absolute right-2 top-2" onClick={handleAccidentalClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Upload Video</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(async (params) => {
            const { uploadUrl, fileType } = await createSignedUploadUrlMutation.write({
              fileName: params.thumbnailUpload.name,
              fileType: params.thumbnailUpload.type,
            });

            const thumbnail = await uploadImage.write({
              file: params.thumbnailUpload,
              type: fileType,
              uploadUrl: uploadUrl,
            });

            await createVideoPost.mutateAsync({
              title: params.title,
              description: params.description,
              price: 0,
              videoId: params.videoId,
              thumbnail,
            })
          })}>
            <AnimatePresence>
              {!videoId && <VideoFormUpload onClose={handleAccidentalClose} />}
              {videoId && <VideoFormDetails onClose={handleAccidentalClose} />}
            </AnimatePresence>
          </form>
        </Form>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`max-sm:min-w-unset !bg-base-300 !rounded-md
      max-sm:w-full shadow-2xl overflow-hidden ${props.className}`}
  />
);
