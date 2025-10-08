import { useState } from "react";
import { UserProfile } from "@/components/ui/user-profile";
import { CommentButton } from "@/features/comments/components/comment-button/comment-button";
import { ReplyFeed } from "@/features/comments/components/reply-feed/reply-feed";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { ReplyIcon } from "@/components/ui/icons/reply";
import { CommentMenu } from "@/features/comments/components/comment/comment-menu";
import { timeAgo } from "@/lib/utils";

export interface CommentProps {
  comment: Optimistic<CommentPost>;
  post: Commentable;
  isReply?: boolean;
  className?: string;
  onReply?: () => void;
  onLike?: any; //FIXME: correct type
}

export const Comment = ({
  comment,
  post,
  isReply,
  className,
  onReply,
}: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div
      className={`flex flex-col p-4 gap-4 h-fit w-full bg-base-100 rounded
        ${className}
        ${comment._optimisticStatus === "pending" ? "opacity-50 pointer-events-none" : ""}
        `}
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

        <div className="flex gap-2 items-center">
          <p>{timeAgo(comment.created_at)}</p>
          <CommentMenu comment={comment} />
        </div>
      </div>
      <p className="text-lg">{comment.text}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <CommentButton
            commentsCount={comment.repliesCount}
            onComment={() => {
              setShowReplies((state) => !state);

              if (!showReplies) {
                onReply && onReply();
              }
            }}
          />
          <LikeButton post={comment} />
        </div>
      </div>
      {showReplies && (
        <div className="flex flex-col w-full px-4 border-t">
          <ReplyFeed comment={comment} />
        </div>
      )}
    </div>
  );
};
