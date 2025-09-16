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
import { Separator } from "@/components/ui/separator";
import { useModals } from "@/hooks/use-modals";
import { useDeleteSocialPost } from "@/features/social/mutations/use-delete-social-post";
// import { usePinSocialPost } from "@/features/social/queries/use-pin-social-post";
import { useSocialPostOwned } from "@/features/social/hooks/use-social-post-owned";
import { useIsSuperAdmin } from "@/features/auth/hooks/use-is-super-admin";

export const SocialPostMenu = ({ socialPost }: { socialPost: SocialPost }) => {
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const deleteSocialPost = useDeleteSocialPost();
  const pinPost = () => {}//usePinSocialPost();
  const isSuperAdmin = useIsSuperAdmin();
  const isOwned = useSocialPostOwned(socialPost);

  return (
    <div className="relative flex" onMouseLeave={() => setOpen(false)}>
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
              {/*<DropdownMenuItem>Edit</DropdownMenuItem>*/}
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
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
            </DropdownMenuGroup>
          )}
          {isSuperAdmin && (
            <>
              <Separator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant={socialPost.pinned ? "destructive" : "default"}
                  onClick={(e) => {
                    e.preventDefault();
                    openModal("ConfirmModal", {
                      title: socialPost.pinned ? "Unpin post" : "Pin post",
                      description: `Are you sure you want to ${socialPost.pinned ? "unpin" : "pin"} this post?`,
                      onConfirm: () => {
                        pinPost.mutate({
                          id: socialPost._id,
                          pinned: !socialPost?.pinned,
                        });
                      },
                    });
                  }}
                >
                  {socialPost.pinned ? "Unpin" : "Pin"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
