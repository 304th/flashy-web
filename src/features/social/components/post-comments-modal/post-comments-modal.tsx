import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { CommentSend } from "@/features/comments/components/comment-send/comment-send";
import { CommentsFeed } from "@/features/comments/components/comments-feed/comments-feed";
import { useUpdateCountOnCommentCreate } from "@/features/social/hooks/useUpdateCountOnCommentCreate";
import { useSocialPostById } from "@/features/social/queries/useSocialPostById";
import { defaultVariants } from "@/lib/framer";

export interface PostCommentsModalProps {
  post: SocialPost;
  onClose(): void;
}

export const PostCommentsModal = ({
  post,
  onClose,
  ...props
}: PostCommentsModalProps) => {
  const [replyComment, setReplyComment] = useState<CommentPost | null>(null);
  const [socialPost] = useSocialPostById(post._id);
  const handleCommentCountUpdate = useUpdateCountOnCommentCreate(post._id);

  return (
    <Modal onClose={onClose} className="!p-0" {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={defaultVariants.container as any}
        className="relative flex p-4 rounded-md"
      >
        <div className="absolute right-2 top-2" onClick={onClose}>
          <CloseButton />
        </div>
        <div className="flex flex-col w-full justify-center"></div>
      </motion.div>
      <div className="flex flex-col gap-4 w-full bg-base-200 border-b">
        <SocialPost
          socialPost={socialPost || post}
          className="rounded-b-none"
        />
      </div>
      <CommentsFeed
        post={post}
        onCommentReply={(comment) => setReplyComment(comment)}
      />
      <CommentSend
        post={post}
        replyComment={replyComment}
        onCommentSend={() => handleCommentCountUpdate}
        onCloseReply={() => setReplyComment(null)}
      />
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset min-w-[450px] !bg-base-200 !rounded-md sm:w-full
      overflow-hidden ${props.className}`}
  />
);
