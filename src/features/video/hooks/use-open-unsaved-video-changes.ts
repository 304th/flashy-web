import { useModals } from "@/hooks/use-modals";

export const useOpenUnsavedVideoChanges = ({
  videoId,
  onConfirmedClose,
}: {
  videoId: string;
  onConfirmedClose: () => void;
}) => {
  const { openModal } = useModals();

  return () =>
    openModal(
      "ConfirmModal",
      {
        title: "Unsaved changes",
        description:
          "Are you sure you want to leave? Changes you made will not be saved.",
        actionTitle: "Leave",
        destructive: true,
        onConfirm: onConfirmedClose,
      },
      { subModal: true },
    );
};
