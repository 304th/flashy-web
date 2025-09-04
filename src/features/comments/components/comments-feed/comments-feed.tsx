import { Separator } from "@/components/ui/separator";
import { Loadable } from "@/components/ui/loadable";
import { Comment } from "@/features/comments/components/comment/comment";
import { useComments } from "@/features/comments/queries/useComments";
import { useCommentsCount } from "@/features/comments/queries/useCommentsCount";

export const CommentsFeed = ({ post }: { post: Reactable }) => {
  const [commentCount, commentsCountQuery] = useCommentsCount(post._id);
  const [comments, commentsQuery] = useComments(post._id);

  return (
    <div className="flex flex-col bg-base-100">
      {
        typeof commentCount === 'number' && <div className="flex w-full px-6 pt-6">
          <Separator>
            {commentCount || 'No'} replies
          </Separator>
        </div>
      }
      <div
        className="flex flex-col w-full justify-center align-center
          min-h-[60px] max-h-[350px] divide-y"
      >
        <Loadable queries={[commentsQuery as any]} fullScreenForDefaults>
          {() =>
            comments?.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))
          }
        </Loadable>
      </div>
    </div>
  );
};
