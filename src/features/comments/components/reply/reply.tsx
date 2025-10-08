import { UserProfile } from "@/components/ui/user-profile";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { ReplyIcon } from "@/components/ui/icons/reply";
import { ReplyMenu } from "@/features/comments/components/reply/reply-menu";
import { timeAgo } from "@/lib/utils";

export interface ReplyProps {
  reply: Optimistic<Reply>;
  comment: CommentPost;
  className?: string;
  onReply?: () => void;
  onLike?: any; //FIXME: correct type
}

export const Reply = ({ reply, comment, className }: ReplyProps) => {
  return (
    <div
      className={`flex flex-col p-4 gap-4 h-fit w-full bg-base-100 rounded
        ${className}
        ${reply._optimisticStatus === "pending" ? "opacity-50 pointer-events-none" : ""}
        `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReplyIcon />
          <UserProfile
            user={{
              fbId: reply.created_by._id,
              username: reply.created_by.username,
              userimage: reply.created_by.userimage,
            }}
          />
        </div>

        <div className="flex gap-2 items-center">
          <p>{timeAgo(reply.created_at)}</p>
          <ReplyMenu reply={reply} />
        </div>
      </div>
      <p className="text-lg">{reply.text}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <LikeButton
            post={reply}
          />
        </div>
      </div>
    </div>
  );
};
