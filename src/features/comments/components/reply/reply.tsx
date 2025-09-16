import { UserProfile } from "@/components/ui/user-profile";
import { LikeButton } from "@/features/reactions/components/like-button/like-button";
import { ReplyIcon } from "@/components/ui/icons/reply";
import { timeAgo } from "@/lib/utils";
import { useReplies } from "@/features/comments/queries/use-replies";
import type { AddLikeParams } from "@/features/reactions/queries/use-add-like";

export interface ReplyProps {
  reply: Optimistic<Reply>;
  comment: CommentPost;
  className?: string;
  onReply?: () => void;
  onLike?: any; //FIXME: correct type
}

export const Reply = ({ reply, comment, className }: ReplyProps) => {
  const { optimisticUpdates: replies } = useReplies(comment._id);

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
          {/*<CommentMenu comment={comment} post={post} />*/}
        </div>
      </div>
      <p className="text-lg">{reply.text}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <LikeButton
            post={reply}
            likeUpdates={[
              async (params: AddLikeParams) => {
                return replies.update(params.id, (reply) => {
                  reply.likesCount += params.isLiked ? 1 : 0;
                  reply.isLiked = true;
                });
              },
            ]}
            unlikeUpdates={[
              async (params: AddLikeParams) => {
                return replies.update(params.id, (reply) => {
                  reply.likesCount += !params.isLiked ? -1 : 0;
                  reply.isLiked = false;
                });
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
