import config from "@/config";
import { useEffect, useState } from "react";
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
import { createSignedUploadUrlMutation } from "@/features/common/mutations/use-create-signed-upload-url";
import { uploadImage } from "@/features/common/mutations/use-upload-image";

export interface VideoCreateModalProps {
  onClose(): void;
}
//TODO: refactor
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
  category: z.string().optional(),
  series: z.string().optional(),
});

export const VideoCreateModal = ({
  onClose,
  ...props
}: VideoCreateModalProps) => {
  const [publishedVideo, setPublishedVideo] = useState<VideoPost | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const createVideoPost = useCreateVideoPost();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      category: undefined,
      series: undefined,
    },
    mode: "all",
  });

  const videoId = form.watch("videoId");
  const openUnsavedChanges = useOpenUnsavedVideoChanges({
    videoId,
    onClose,
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<any>;
      setIsUploading(Boolean(ce.detail?.isUploading));
    };

    window.addEventListener("video-upload-state-change", handler as EventListener);

    return () => {
      window.removeEventListener(
        "video-upload-state-change",
        handler as EventListener,
      );
    };
  }, []);

  const handleAccidentalClose = () => {
    if ((!videoId && !isUploading) || form.formState.isSubmitSuccessful) {
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

              const newVideo = await createVideoPost.mutateAsync({
                title: params.title,
                description: params.description,
                price: 0,
                videoId: params.videoId,
                thumbnail,
                videoDuration: params.videoDuration,
                statusweb: params.status as "draft" | "published",
                publishDate:
                  params.status === "published" ? Date.now() : undefined,
                category: params.category,
                series: params.series,
              });

              if (params.status === "published") {
                setPublishedVideo(newVideo);
              } else {
                onClose();
              }
            })}
          >
            <AnimatePresence>
              {(!videoId || isUploading) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <VideoFormUpload onClose={handleAccidentalClose} />
                </motion.div>
              )}
              {videoId && !publishedVideo && !isUploading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <VideoFormDetails
                    onClose={handleAccidentalClose}
                  />
                </motion.div>
              )}
              {publishedVideo && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <VideoCreateSuccess video={publishedVideo} />
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
