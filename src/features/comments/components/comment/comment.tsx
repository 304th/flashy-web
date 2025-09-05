import { useState } from "react";
import { UserProfile } from "@/components/ui/user-profile";
import { CommentButton } from "@/features/comments/components/comment-button/comment-button";
import { ReplyFeed } from "@/features/comments/components/reply-feed/reply-feed";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { ReplyIcon } from "@/components/ui/icons/reply";
import { timeAgo } from "@/lib/utils";

export interface CommentProps {
  comment: CommentPost | Reply;
  isReply?: boolean;
  className?: string;
  onReply?: () => void;
  onLike?: any; //FIXME: correct type
}

export const isComment = (post: CommentPost | Reply): post is CommentPost =>
  "repliesCount" in post;

export const Comment = ({
  comment,
  isReply,
  className,
  onReply,
  onLike,
}: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div
      className={`flex flex-col p-4 gap-3 h-fit w-full bg-base-100 rounded
        ${className}`}
      style={showReplies ? { paddingBottom: 0 } : {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isReply && <ReplyIcon />}
          <UserProfile
            user={{
              fbId: comment.created_by._id,
              username: comment.created_by.username,
              userimage: comment.created_by.userimage,
            }}
          />
        </div>

        <div className="flex items-center">
          <p>{timeAgo(comment.created_at)}</p>
        </div>
      </div>
      <p className="text-lg">{comment.text}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {!isReply && isComment(comment) && (
            <CommentButton
              commentsCount={comment.repliesCount}
              onComment={() => {
                setShowReplies((state) => !state);

                if (!showReplies) {
                  onReply && onReply();
                }
              }}
            />
          )}
          <LikeButton post={comment} onAdd={onLike} onRemove={onLike} />
        </div>
      </div>
      {showReplies && isComment(comment) && (
        <div className="flex flex-col w-full px-4 border-t">
          <ReplyFeed comment={comment} />
        </div>
      )}
    </div>
  );
};
