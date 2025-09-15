import { AnimatePresence, motion } from "framer-motion";
import { Loadable } from "@/components/ui/loadable";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Reply } from "@/features/comments/components/reply/reply";
import { CommentFeedEmpty } from "@/features/comments/components/comments-feed/comment-feed-empty";
import { useReplies } from "@/features/comments/queries/use-replies";

export const ReplyFeed = ({ comment }: { comment: CommentPost }) => {
  const { data: replies, query } = useReplies(comment._id);
  // const handleLikeReply = useLikeReplyMutate(comment._id);

  return (
    <div className="flex flex-col bg-base-100">
      <Loadable
        queries={[query as any]}
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
                <AnimatePresence initial={false} mode="popLayout">
                  {replies?.map((reply) => (
                    <motion.div
                      key={reply._optimisticId || reply._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout="position"
                    >
                      <Reply key={reply._id} reply={reply} comment={comment} />
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
