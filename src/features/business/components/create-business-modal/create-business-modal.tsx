import { AnimatePresence } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { CreateBusinessForm } from "@/features/business/components/create-business-modal/create-business-form";
import { CreateBusinessPendingScreen } from "@/features/business/components/create-business-modal/create-business-pending-screen";
import { useMyBusinessAccount } from "@/features/business";

export interface CreateBusinessModalProps {
  onClose(): void;
}

export const CreateBusinessModal = ({ onClose }: CreateBusinessModalProps) => {
  const { data: businessAccounts } = useMyBusinessAccount();

  return (
    <ModalComponent
      className="bg-base-300 p-0! max-sm:min-w-unset max-w-full min-w-[600px]"
      onClose={onClose}
    >
      <div className="relative w-full max-w-2xl rounded-md">
        <div className="flex w-full p-4 pb-4">
          <div className="absolute right-4 top-4" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <h2 className="text-2xl font-extrabold text-white">
              Register A Business Account
            </h2>
          </div>
        </div>
        <AnimatePresence>
          {businessAccounts?.[0]?.status === "pending" ? (
            <CreateBusinessPendingScreen />
          ) : (
            <CreateBusinessForm onClose={onClose} />
          )}
        </AnimatePresence>
      </div>
    </ModalComponent>
  );
};
