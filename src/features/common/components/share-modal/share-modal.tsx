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
import { defaultVariants } from "@/lib/framer";

export interface ShareModalProps {
  id: string;
  type: "social" | "video" | "channel";
  title: string;
  onConfirm(): void;
  onCancel?(): void;
  onClose(): void;
}

export const ShareModal = ({
  id,
  type,
  onConfirm,
  onCancel,
  onClose,
  ...props
}: ShareModalProps) => {
  const [url, title] = useMemo(() => {
    const info = getShareableInfo(id, type);

    return [
      typeof window !== "undefined"
        ? window.location.origin + info.path
        : info.path,
      info.title,
    ];
  }, [id, type]);

  return (
    <Modal onClose={onClose} className={"!p-0"} {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        className="relative flex flex-col p-6 gap-6 rounded-md bg-cover
          bg-center"
        style={{ backgroundImage: `url(/images/forest.png)` }}
      >
        <div className="flex w-full">
          <div className="absolute right-2 top-2" onClick={onClose}>
            <CloseButton />
          </div>
          <div className="flex flex-col w-full justify-center">
            <p className="text-2xl font-extrabold text-white">Share</p>
          </div>
        </div>
        <motion.div
          className="flex items-center justify-center gap-3"
          initial="hidden"
          animate="show"
          variants={defaultVariants.container}
        >
          <motion.div
            className="p-1 bg-base-400 rounded-md"
            variants={defaultVariants.child}
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <TwitterShareButton title={title} url={url} className="flex">
                <XIcon borderRadius={8} size={56} />
              </TwitterShareButton>
            </motion.div>
          </motion.div>
          <motion.div
            className="p-1 bg-base-400 rounded-md"
            variants={defaultVariants.child}
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <TelegramShareButton title={title} url={url} className="flex">
                <TelegramIcon borderRadius={8} size={56} />
              </TelegramShareButton>
            </motion.div>
          </motion.div>
          <motion.div
            className="p-1 bg-base-400 rounded-md"
            variants={defaultVariants.child}
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <ThreadsShareButton title={title} url={url} className="flex">
                <ThreadsIcon borderRadius={8} size={56} />
              </ThreadsShareButton>
            </motion.div>
          </motion.div>
          <motion.div
            className="p-1 bg-base-400 rounded-md"
            variants={defaultVariants.child}
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <WhatsappShareButton title={title} url={url} className="flex">
                <WhatsappIcon borderRadius={8} size={56} />
              </WhatsappShareButton>
            </motion.div>
          </motion.div>
          <motion.div
            className="p-1 bg-base-400 rounded-md"
            variants={defaultVariants.child}
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <BlueskyShareButton title={title} url={url} className="flex">
                <BlueskyIcon borderRadius={8} size={56} />
              </BlueskyShareButton>
            </motion.div>
          </motion.div>
        </motion.div>
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

const getShareableInfo = (
  id: ShareModalProps["id"],
  type: ShareModalProps["type"],
): { path: string; title: string } => {
  switch (type) {
    case "social":
      return {
        path: `/social/post?id=${id}`,
        title: "Check out this post",
      };
    case "video":
      return {
        path: `/video/post?id=${id}`,
        title: "Check out this video",
      };
    case "channel":
    default:
      return {
        path: `/channel/social?id=${id}`,
        title: "Check out this channel",
      };
  }
};
