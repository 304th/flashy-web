import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { MeatballIcon } from "@/components/ui/icons/meatball";
import { useModals } from "@/hooks/use-modals";
import { useCommentOwned } from "@/features/comments/hooks/use-comment-owned";
import {
  type DeleteCommentParams,
  useDeleteComment,
} from "@/features/comments/mutations/use-delete-comment";
import { useComments } from "@/features/comments/queries/use-comments";
import { OptimisticUpdate } from "@/lib/query-toolkit";

export const CommentMenu = ({
  comment,
  post,
  deleteCommentUpdates,
}: {
  comment: CommentPost | Reply;
  post: Commentable;
  deleteCommentUpdates?: OptimisticUpdate<DeleteCommentParams>[];
}) => {
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const { optimisticUpdates: comments } = useComments(post._id);
  const deleteComment = useDeleteComment({
    optimisticUpdates: [async (params) => comments.delete(params.id)],
  });
  const isOwned = useCommentOwned(comment);

  return (
    <div className="relative flex z-0" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[50px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild className="relative z-1">
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            className="relative z-1"
          >
            <MeatballIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="flex flex-col bg-base-300 border-base-400 p-1 gap-1"
          align="end"
        >
          {isOwned && (
            <DropdownMenuGroup className="flex flex-col gap-[2px]">
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  openModal(
                    "ConfirmModal",
                    {
                      title: "Delete comment",
                      description:
                        "Are you sure you want to delete this comment?",
                      destructive: true,
                      onConfirm: () => {
                        deleteComment.mutate({
                          id: comment._id,
                        });
                      },
                    },
                    { subModal: true },
                  );
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
