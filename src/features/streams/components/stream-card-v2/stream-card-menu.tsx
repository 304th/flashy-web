import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MeatballIcon } from "@/components/ui/icons/meatball";
import { useModals } from "@/hooks/use-modals";
import { useMe } from "@/features/auth/queries/use-me";
import { useDeleteStream } from "@/features/streams/mutations/use-delete-stream";

export const StreamCardMenu = ({
  stream,
  size = "sm",
}: {
  stream: Stream;
  size?: "sm" | "default" | "xs" | "lg" | "xl" | "icon";
}) => {
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const deleteStream = useDeleteStream();

  if (!me) {
    return null;
  }

  const isOwned = me.fbId === stream.userId;

  return (
    <div className="relative flex" onMouseLeave={() => setOpen(false)}>
      {open && <div className="absolute w-[50px] h-8 right-0 bottom-[-8px]" />}
      <DropdownMenu modal={false} open={open}>
        <DropdownMenuTrigger asChild className="relative z-1">
          <Button
            className="!w-fit p-0 aspect-square"
            variant="secondary"
            size={size}
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <MeatballIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="flex flex-col bg-base-300 border-base-400 p-1 gap-1"
          align="end"
        >
          {isOwned && (
            <DropdownMenuGroup className="flex flex-col gap-[2px]">
              <DropdownMenuItem
                onClick={(e) => {
                  setOpen(false);
                  e.preventDefault();
                  openModal("StreamSettingsModal", {
                    stream,
                  });
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  setOpen(false);
                  e.preventDefault();
                  openModal("StreamKeyModal", {
                    stream,
                  });
                }}
              >
                Stream Key
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  setOpen(false);
                  e.preventDefault();
                  openModal("ConfirmModal", {
                    title: "Delete stream",
                    description: "Are you sure you want to delete this stream?",
                    destructive: true,
                    onConfirm: () => {
                      deleteStream.mutate({
                        streamId: stream._id,
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
