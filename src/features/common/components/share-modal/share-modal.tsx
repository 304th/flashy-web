import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TwitterShareButton,
  TelegramShareButton,
  ThreadsShareButton,
  WhatsappShareButton,
  BlueskyShareButton,
  XIcon,
  TelegramIcon,
  ThreadsIcon,
  WhatsappIcon,
  BlueskyIcon,
} from "react-share";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { Button } from "@/components/ui/button";

export interface ShareModalProps {
  post: Shareable;
  onConfirm(): void;
  onCancel?(): void;
  onClose(): void;
}

export const ShareModal = ({
  post,
  onConfirm,
  onCancel,
  onClose,
  ...props
}: ShareModalProps) => {
  const shareableLink = useMemo(
    () => (typeof window !== "undefined" ? window.location.href : ""),
    [],
  );

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col p-6 gap-6 rounded-md"
      >
        <div className="flex w-full">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Share</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.2 }}>
            <TwitterShareButton title="Flashy Social Post" url={shareableLink}>
              <XIcon borderRadius={8} size={48} />
            </TwitterShareButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }}>
            <TelegramShareButton title="Flashy Social Post" url={shareableLink}>
              <TelegramIcon borderRadius={8} size={48} />
            </TelegramShareButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }}>
            <ThreadsShareButton title="Flashy Social Post" url={shareableLink}>
              <ThreadsIcon borderRadius={8} size={48} />
            </ThreadsShareButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }}>
            <WhatsappShareButton title="Flashy Social Post" url={shareableLink}>
              <WhatsappIcon borderRadius={8} size={48} />
            </WhatsappShareButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }}>
            <BlueskyShareButton title="Flashy Social Post" url={shareableLink}>
              <BlueskyIcon borderRadius={8} size={48} />
            </BlueskyShareButton>
          </motion.div>
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
        </div>
      </motion.div>
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset min-w-[500px] !p-0 !bg-base-200 !rounded-md
      sm:w-full overflow-hidden ${props.className}`}
  />
);
