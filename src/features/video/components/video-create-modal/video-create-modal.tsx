import config from "@/config";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { VideoFormUpload } from "@/features/video/components/video-create-modal/video-form-upload";
import { VideoFormDetails } from "@/features/video/components/video-create-modal/video-form-details";
import { VideoCreateSuccess } from "@/features/video/components/video-create-modal/video-create-success";
import { useCreateVideoPost } from "@/features/video/mutations/use-create-video-post";
import { useOpenUnsavedVideoChanges } from "@/features/video/hooks/use-open-unsaved-video-changes";
import { useSubmitNewVideo } from "@/features/video/hooks/use-submit-new-video";
import { useState } from "react";

export interface VideoCreateModalProps {
  onClose(): void;
}

const formSchema = z.object({
  videoId: z.string(),
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
  videoDuration: z.number().min(0),
  status: z.string(),
});

export const VideoCreateModal = ({
  onClose,
  ...props
}: VideoCreateModalProps) => {
  const [videoPublished, setVideoPublished] = useState(false);
  const submitNewVideo = useSubmitNewVideo((params) => {
    if (params.status === "published") {
      setVideoPublished(true);
    }
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
    },
    mode: "all",
  });

  const videoId = form.watch("videoId");
  const openUnsavedChanges = useOpenUnsavedVideoChanges({
    videoId,
    onClose,
  });

  const handleAccidentalClose = () => {
    if (!videoId || form.formState.isSubmitSuccessful) {
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
          <div
            className="absolute right-2 top-2"
            onClick={handleAccidentalClose}
          >
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Upload Video</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitNewVideo)}>
            <AnimatePresence>
              {!videoId && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <VideoFormUpload onClose={handleAccidentalClose} />
                </motion.div>
              )}
              {videoId && !videoPublished && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <VideoFormDetails
                    onClose={handleAccidentalClose}
                    onSuccess={() => setVideoPublished(true)}
                  />
                </motion.div>
              )}
              {videoPublished && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <VideoCreateSuccess />
                </motion.div>
              )}
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
    className={`max-sm:min-w-unset !bg-base-300 !rounded-md max-sm:w-full
      shadow-2xl overflow-hidden ${props.className}`}
  />
);
