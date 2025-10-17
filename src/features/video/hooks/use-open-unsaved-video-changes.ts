import { useModals } from "@/hooks/use-modals";
import { useDeleteVideo } from "@/features/video/mutations/use-delete-video";

export const useOpenUnsavedVideoChanges = ({ videoId, onClose }: { videoId: string; onClose: () => void; }) => {
  const { openModal } = useModals();
  const deleteVideo = useDeleteVideo();

  return () => openModal(
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
}