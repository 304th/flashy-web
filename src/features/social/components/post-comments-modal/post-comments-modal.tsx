import React, { useState } from "react";
import { Modal as ModalComponent } from "@/packages/modals";
import { CloseButton } from "@/components/ui/close-button";
import { SocialPost } from "@/features/social/components/social-post/social-post";
import { CommentSend } from "@/features/comments/components/comment-send/comment-send";
import { CommentsFeed } from "@/features/comments/components/comments-feed/comments-feed";
import { useSubsetQuery } from "@/lib/query-toolkit";
import { useMe } from "@/features/auth/queries/use-me";
import {
  useSocialFeedUpdatesOnReactionAdd,
  useSocialFeedUpdatesOnReactionRemove,
} from "@/features/social/hooks/use-social-feed-reaction-updates";
import { useSocialFeedRelightUpdates } from "@/features/social/hooks/use-social-feed-relight-updates";
import { useComments } from "@/features/comments/queries/use-comments";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";

export interface PostCommentsModalProps {
  postId: string;
  onClose(): void;
}

export const PostCommentsModal = ({
  postId,
  onClose,
  ...props
}: PostCommentsModalProps) => {
  const { data: me } = useMe();
  const [replyComment, setReplyComment] = useState<CommentPost | null>(null);
  const { optimisticUpdates: socialFeed } = useSocialPosts();
  const [socialPost] = useSubsetQuery<SocialPost, SocialPost[]>({
    key: postId,
    existingQueryKey: ["social", me?.fbId],
    selectorFn: (socialPosts) =>
      socialPosts.filter((post) => post._id === postId)[0],
    deps: [postId],
  });

  const { optimisticUpdates: comments } = useComments(postId);
  // const likeUpdates = useSocialFeedUpdatesOnReactionAdd();
  // const unlikeUpdates = useSocialFeedUpdatesOnReactionRemove();
  // const relightUpdates = useSocialFeedRelightUpdates();

  if (!socialPost) {
    //FIXME: put lower so that modal is not glitched out
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
        <div
          className="relative flex flex-col gap-4 w-full bg-base-200 border-b
            z-1"
        >
          <SocialPost socialPost={socialPost} className="rounded-b-none" />
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
        sendCommentUpdates={[
          async (params) => {
            return await comments.prepend(params, { sync: true });
          },
          async (params) => {
            return await socialFeed.update(params.postId, (post) => {
              post.commentsCount += 1;
            });
          },
        ]}
        onCloseReply={() => setReplyComment(null)}
      />
    </Modal>
  );
};

const Modal = (props: any) => (
  <ModalComponent
    {...props}
    className={`sm:min-w-unset min-w-[600px] overflow-hidden !bg-base-200
      !rounded-md sm:w-full ${props.className}`}
  />
);
