import React, { useState } from "react";
import {AnimatePresence, motion} from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { VideoUpload } from "@/features/video/components/video-create-modal/video-upload";
import {VideoForm} from "@/features/video/components/video-create-modal/video-form";
import {useModals} from "@/hooks/use-modals";
import {useDeleteVideo} from "@/features/video/mutations/use-delete-video";

export interface VideoCreateModalProps {
  onClose(): void;
}

export const VideoCreateModal = ({
  onClose,
  ...props
}: VideoCreateModalProps) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const { openModal } = useModals();
  const deleteVideo = useDeleteVideo();

  const handleAccidentalClose = () => {
    openModal(
      'ConfirmModal',
      {
        title: 'Unsaved changes',
        description:
          'Are you sure you want to leave? Changes you made will not be saved.',
        actionTitle: 'Leave',
        destructive: true,
        onConfirm: async () => {
          if (videoId) {
            await deleteVideo.mutateAsync({
              videoId: videoId,
            })
          }
          onClose();
        },
      },
      { subModal: true },
    );
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
        <AnimatePresence>
          {!videoId && <VideoUpload onSuccess={setVideoId} onClose={handleAccidentalClose} />}
          {videoId && <VideoForm videoId={videoId} />}
        </AnimatePresence>
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
