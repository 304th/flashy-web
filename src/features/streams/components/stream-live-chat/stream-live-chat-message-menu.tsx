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
import { useMe } from "@/features/auth/queries/use-me";
import { useIsStreamChatMessageOwned } from "@/features/streams/hooks/use-is-stream-chat-message-owned";
import { useDeleteStreamChatMessage } from "@/features/streams/mutations/use-delete-stream-chat-message";
import { useIsStreamHost } from "@/features/streams/hooks/use-is-stream-host";

export const StreamLiveChatMessageMenu = ({ chatMessage, stream }: { chatMessage: ChatMessage; stream: Stream }) => {
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const { openModal } = useModals();
  const deleteChatMessage = useDeleteStreamChatMessage();
  const isStreamHost = useIsStreamHost(stream);
  const isOwned = useIsStreamChatMessageOwned(chatMessage)

  if (!me || chatMessage.user.fbId === stream.userId) {
    return null;
  }

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
          {(isOwned || isStreamHost) && (
            <DropdownMenuGroup className="flex flex-col gap-[2px]">
              {/*<DropdownMenuItem>Edit</DropdownMenuItem>*/}
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  setOpen(false);
                  e.preventDefault();
                  openModal("ConfirmModal", {
                    title: "Delete post",
                    description: "Are you sure you want to delete this message?",
                    destructive: true,
                    onConfirm: () => {
                      deleteChatMessage.mutate({
                        messageId: chatMessage._id,
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
