import { UserProfile } from "@/components/ui/user-profile";
import { timeAgo } from "@/lib/utils";
import { CommentButton } from "@/features/comments/components/comment-button/comment-button";

export interface CommentProps {
  comment: CommentReply;
  className?: string;
}

export const Comment = ({ comment, className }: CommentProps) => {
  return (
    <div
      className={`flex flex-col p-4 gap-3 h-fit w-[600px] bg-base-100 rounded
        ${className}`}
    >
      <div className="flex items-center justify-between">
        <UserProfile
          user={{
            fbId: comment.created_by._id,
            username: comment.created_by.username,
            userimage: comment.created_by.userimage,
          }}
        />
        <div className="flex items-center">
          <p>{timeAgo(comment.created_at)}</p>
        </div>
      </div>
      <p className="text-lg">{comment.text}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <CommentButton
            commentsCount={comment.repliesCount}
            onComment={() => {}}
          />
          {/*<LikeButton*/}
          {/*  post={comment}*/}
          {/*  onAdd={handleAddMutate}*/}
          {/*  onRemove={handleRemoveMutate}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
};
