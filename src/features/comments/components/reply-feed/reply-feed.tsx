import { AnimatePresence, motion } from "framer-motion";
import { Loadable } from "@/components/ui/loadable";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Comment } from "@/features/comments/components/comment/comment";
import { CommentFeedEmpty } from "@/features/comments/components/comments-feed/comment-feed-empty";
import { useReplies } from "@/features/comments/queries/use-replies";
import { useLikeReplyMutate } from "@/features/comments/hooks/use-like-reply-mutate";

export const ReplyFeed = ({ comment }: { comment: CommentPost }) => {
  const [replies, repliesQuery] = useReplies(comment._id);
  const handleLikeReply = useLikeReplyMutate(comment._id);

  return (
    <div className="flex flex-col bg-base-100">
      <Loadable
        queries={[repliesQuery]}
        fallback={
          <div className="flex justify-center w-full p-6">
            <Spinner className="!h-5" />
          </div>
        }
      >
        {() => {
          if (replies?.length === 0) {
            return <CommentFeedEmpty />;
          }

          return (
            <div className="relative flex flex-col">
              <div
                className="flex flex-col w-fullalign-center min-h-[60px]
                  divide-y"
              >
                <AnimatePresence initial={false}>
                  {replies?.map((reply) => (
                    <motion.div
                      key={reply._id}
                      initial={{ opacity: 0, y: 1 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Comment
                        key={reply._id}
                        comment={reply}
                        isReply
                        onLike={handleLikeReply}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        }}
      </Loadable>
    </div>
  );
};
