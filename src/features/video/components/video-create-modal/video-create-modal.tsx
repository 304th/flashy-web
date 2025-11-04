import config from "@/config";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useDeleteUploadedVideo } from "@/features/video/mutations/use-delete-uploaded-video";

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

type Step = 'upload' | 'details' | 'success';

export const VideoCreateModal = ({
  onClose,
  ...props
}: VideoCreateModalProps) => {
  const [step, setStep] = useState<Step>('upload');
  const [publishedVideo, setPublishedVideo] = useState<VideoPost | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const createVideoPost = useCreateVideoPost();
  const deleteUploadedVideo = useDeleteUploadedVideo();
  const abortUploadRef = useRef<(() => void) | null>(null);

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

  // Cleanup function: abort upload if in progress, delete video if exists
  const cleanup = useCallback(() => {
    // Abort upload if in progress
    if (abortUploadRef.current) {
      abortUploadRef.current();
    }

    // Delete uploaded video if it exists
    const currentVideoId = form.getValues("videoId");
    if (currentVideoId) {
      deleteUploadedVideo.mutate({ videoId: currentVideoId });
    }

    // Reset form and step to prevent unwanted transitions
    form.reset();
    setStep('upload');
  }, [deleteUploadedVideo, form]);

  const handleConfirmedClose = useCallback(() => {
    cleanup();
    onClose();
  }, [cleanup, onClose]);

  const openUnsavedChanges = useOpenUnsavedVideoChanges({
    videoId,
    onConfirmedClose: handleConfirmedClose,
  });

  // Step transitions
  useEffect(() => {
    if (videoId && !isUploading && step === 'upload') {
      setStep('details');
    }
  }, [videoId, isUploading, step]);

  useEffect(() => {
    if (publishedVideo) {
      setStep('success');
    }
  }, [publishedVideo]);

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
            <AnimatePresence mode="wait">
              {step === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <VideoFormUpload
                    onCancel={handleAccidentalClose}
                    onConfirmedClose={handleConfirmedClose}
                    onUploadingChange={setIsUploading}
                    onAbortRefChange={(abortFn) => {
                      abortUploadRef.current = abortFn;
                    }}
                  />
                </motion.div>
              )}
              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <VideoFormDetails onClose={handleAccidentalClose} />
                </motion.div>
              )}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <VideoCreateSuccess video={publishedVideo!} />
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
