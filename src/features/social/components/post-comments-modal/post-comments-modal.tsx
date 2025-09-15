import React, { useState } from "react";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { CommentSend } from "@/features/comments/components/comment-send/comment-send";
import { CommentsFeed } from "@/features/comments/components/comments-feed/comments-feed";
import { useQuerySubset } from "@/lib/query.v3";
import { useMe } from "@/features/auth/queries/use-me";
import {
  useSocialFeedUpdatesOnReactionAdd,
  useSocialFeedUpdatesOnReactionRemove
} from "@/features/social/hooks/use-social-feed-reaction-updates";
import {useSocialFeedRelightUpdates} from "@/features/social/hooks/use-social-feed-relight-updates";

export interface PostCommentsModalProps {
  postId: string;
  onClose(): void;
}

export const PostCommentsModal = ({
  postId,
  onClose,
  ...props
}: PostCommentsModalProps) => {
  const [me] = useMe();
  const [replyComment, setReplyComment] = useState<CommentPost | null>(null);
  const socialPost = useQuerySubset<SocialPost, SocialPost[]>({
    existingQueryKey: ["social", me?.fbId],
    selectorFn: (socialPosts) => socialPosts.filter(post => post._id === postId)[0],
    deps: [postId],
  });
  const likeUpdates = useSocialFeedUpdatesOnReactionAdd();
  const unlikeUpdates = useSocialFeedUpdatesOnReactionRemove();
  const relightUpdates = useSocialFeedRelightUpdates();

  // const handleCommentCountUpdate = useUpdateCountOnCommentCreate(socialPost._id);

  if (!socialPost) {
    return null;
  }

  return (
    <Modal onClose={onClose} className="!p-[0]" {...props}>
      <div className="relative flex p-6 rounded-md">
        <div className="absolute right-2 top-2" onClick={onClose}>
          <CloseButton />
        </div>
      </div>
      <div
        className="flex flex-col w-full overflow-y-scroll max-h-[70vh] mb-[1px]"
      >
        <div className="flex flex-col gap-4 w-full bg-base-200 border-b">
          <SocialPost
            socialPost={socialPost}
            likeUpdates={likeUpdates}
            unlikeUpdates={unlikeUpdates}
            relightUpdates={relightUpdates}
            className="rounded-b-none"
          />
        </div>
        <CommentsFeed
          post={socialPost}
          onCommentReply={(comment) => setReplyComment(comment)}
        />
      </div>
      <CommentSend
        post={socialPost}
        replyComment={replyComment}
        className="sticky bottom-0 w-full shrink-0 rounded-br-md rounded-bl-md
          border-t z-1"
        onCommentSend={() => {}}
        onCloseReply={() => setReplyComment(null)}
      />
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset min-w-[450px] overflow-hidden !bg-base-200
      !rounded-md sm:w-full ${props.className}`}
  />
);
