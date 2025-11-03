import { useModals } from "@/hooks/use-modals";
import { useDeleteUploadedVideo } from "@/features/video/mutations/use-delete-uploaded-video";

export const useOpenUnsavedVideoChanges = ({
  videoId,
  onClose,
}: {
  videoId: string;
  onClose: () => void;
}) => {
  const { openModal } = useModals();
  const deleteUploadedVideo = useDeleteUploadedVideo();

  return () =>
    openModal(
      "ConfirmModal",
      {
        title: "Unsaved changes",
        description:
          "Are you sure you want to leave? Changes you made will not be saved.",
        actionTitle: "Leave",
        destructive: true,
        onConfirm: () => {
          // Ensure any in-flight upload is aborted
          try {
            window.dispatchEvent(new CustomEvent("abort-video-upload"));
          } catch {}

          if (videoId) {
            deleteUploadedVideo.mutate(
              {
                videoId: videoId,
              },
              {
                onSuccess: onClose,
              },
            );
          }

          onClose();
        },
      },
      { subModal: true },
    );
};
