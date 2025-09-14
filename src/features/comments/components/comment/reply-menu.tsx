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
import { useDeleteComment } from "@/features/comments/queries/use-delete-comment";
import { useDeleteCommentMutate } from "@/features/comments/hooks/use-delete-comment-mutate";

export const ReplyMenu = ({ comment }: { comment: CommentPost | Reply }) => {
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const deleteCommentsMutate = useDeleteCommentMutate(post._id);
  const deleteComment = useDeleteComment({
    onMutate: deleteCommentsMutate,
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
                  openModal("ConfirmModal", {
                    title: "Delete comment",
                    description:
                      "Are you sure you want to delete this comment?",
                    destructive: true,
                    onConfirm: () => {
                      deleteComment.mutate({
                        id: comment._id,
                      });
                    },
                  });
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
