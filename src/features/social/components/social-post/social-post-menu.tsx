import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { MeatballIcon } from "@/components/ui/icons/meatball";
import { useModals } from "@/hooks/use-modals";
import { useDeleteSocialPost } from "@/features/social/queries/useDeleteSocialPost";
import { useDeleteSocialPostMutate } from "@/features/social/hooks/use-delete-social-post-mutate";
import { useSocialPostOwned } from "@/features/social/hooks/use-social-post-owned";

export const SocialPostMenu = ({ socialPost }: { socialPost: SocialPost }) => {
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const deletePostMutate = useDeleteSocialPostMutate();
  const deleteSocialPost = useDeleteSocialPost({
    onMutate: deletePostMutate,
  });
  const isOwned = useSocialPostOwned(socialPost);

  return (
    <div className="relative flex" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[50px] h-8 right-0 bottom-[-8px]" />}

      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild className="relative z-1">
          <IconButton onClick={() => setOpen(true)} className="relative z-1">
            <MeatballIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-base-300 border-base-400 p-1"
          align="end"
        >
          {isOwned && <DropdownMenuItem>Edit</DropdownMenuItem>}
          {isOwned && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                openModal("ConfirmModal", {
                  title: "Delete post",
                  description: "Are you sure you want to delete this post?",
                  destructive: true,
                  onConfirm: () => {
                    deleteSocialPost.mutate({
                      id: socialPost._id,
                    });
                  },
                });
              }}
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
