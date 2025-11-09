import { AnimatePresence, motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { Separator } from "@/components/ui/separator";
import { CloseButton } from "@/components/ui/close-button";
import { GoLiveDetailsForm } from "@/features/streams/components/go-live-modal/go-live-details-form";
import { GoLiveSecurityForm } from "@/features/streams/components/go-live-modal/go-live-security-form";

export interface GoLiveModalProps {
  onClose(): void;
}

export const GoLiveModal = ({ onClose }: GoLiveModalProps) => {
  return (
    <ModalComponent
      className="bg-base-300 p-0! max-sm:min-w-unset max-w-full min-w-[600px]
        overflow-hidden"
      onClose={onClose}
    >
      <div className="relative w-full max-w-2xl rounded-md bg-base-300">
        <div className="flex w-full p-4">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">
              Go Live Settings
            </p>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            key="details"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GoLiveSecurityForm />
            <Separator>Stream Settings</Separator>
            <GoLiveDetailsForm onClose={onClose} />
          </motion.div>
        </AnimatePresence>
      </div>
    </ModalComponent>
  );
};
