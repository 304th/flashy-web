import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Loadable } from "@/components/ui/loadable";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Comment } from "@/features/comments/components/comment/comment";
import { CommentFeedEmpty } from "@/features/comments/components/comments-feed/comment-feed-empty";
import { useComments } from "@/features/comments/queries/useComments";
import { useCommentsCount } from "@/features/comments/queries/useCommentsCount";

export const CommentsFeed = ({ post }: { post: Reactable }) => {
  const [commentCount, commentsCountQuery] = useCommentsCount(post._id);
  const [comments, commentsQuery] = useComments(post._id);

  return (
    <div className="flex flex-col bg-base-100">
      <Loadable queries={[commentsQuery as any, commentsCountQuery]} fallback={<div className="flex justify-center w-full p-6">
        <Separator>
          <Spinner className="!h-5" />

        </Separator>
      </div>}>
        {() => {
          if (comments?.length === 0) {
            return <CommentFeedEmpty />
          }

          return <div className="relative flex flex-col">
            <div className="flex w-full px-6 pt-6">
              <Separator>
                {commentCount} replies
              </Separator>
            </div>
            <div
              className="flex flex-col w-fullalign-center
          min-h-[60px] max-h-[350px] overflow-scroll divide-y"
            >
              <AnimatePresence initial={false}>
                {comments?.map((comment) => (
                  <motion.div key={comment._id} initial={{ opacity: 0, y: 2}} animate={{ opacity: 1, y: 0 }}>
                    <Comment key={comment._id} comment={comment} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        }}
      </Loadable>
    </div>
  );
};
