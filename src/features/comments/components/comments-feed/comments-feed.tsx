import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Loadable } from "@/components/ui/loadable";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Comment } from "@/features/comments/components/comment/comment";
import { CommentFeedEmpty } from "@/features/comments/components/comments-feed/comment-feed-empty";
import { useComments } from "@/features/comments/queries/use-comments";

export interface CommentsFeedProps {
  post: Commentable;
  className?: string;
  onCommentReply: (comment: CommentPost) => void;
}

export const CommentsFeed = ({
  post,
  className,
  onCommentReply,
}: CommentsFeedProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { data: comments, query } = useComments(post._id);

  useEffect(() => {
    if (comments?.length) {
      listRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  }, [comments?.length]);

  return (
    <div className="flex flex-col bg-base-150">
      <Loadable
        queries={[query as any]}
        fallback={
          <div className="flex justify-center w-full p-6">
            <Separator>
              <Spinner className="!h-5" />
            </Separator>
          </div>
        }
      >
        {() => {
          if (comments?.length === 0) {
            return <CommentFeedEmpty />;
          }

          return (
            <div className="relative flex flex-col bg-base-100">
              <div className="flex w-full px-4 pt-4">
                <Separator>{comments?.length} comments</Separator>
              </div>
              <div
                ref={listRef}
                className={`flex flex-col w-full align-center min-h-[60px]
                max-h-[350px] overflow-scroll divide-y ${className}`}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {comments?.map((comment) => (
                    <motion.div
                      key={comment._optimisticId || comment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout="position"
                    >
                      <Comment
                        key={comment._id}
                        comment={comment}
                        post={post}
                        onReply={() => onCommentReply(comment)}
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
