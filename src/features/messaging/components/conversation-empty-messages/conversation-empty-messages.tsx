// import { useMemo } from "react";
// import { format } from "date-fns";
// import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// import { useConversationCreator } from "@/features/messaging/hooks/use-conversation-creator";
import { Separator } from "@/components/ui/separator";
import { useCreateMessage } from "@/features/messaging/mutations/use-create-message";
import { useCreateConversation } from "@/features/messaging/mutations/use-create-conversation";
import { useCreateConversationWithMessage } from "@/features/messaging/mutations/use-create-conversation-with-message";
import { useNewConversationUser } from "@/features/messaging/hooks/use-new-conversation-user";

export const ConversationEmptyMessages = ({ userId }: { userId?: string }) => {
  const [newChatUser] = useNewConversationUser();
  const createChat = useCreateConversation();
  const createMessage = useCreateMessage();
  const createChatWithMessage = useCreateConversationWithMessage();

  return (
    <div className="flex flex-col items-center w-full gap-3">
      <Separator>
        <p className="text-sm">
          This is the start of you conversation with{" "}
          <span className="text-brand-200">@{newChatUser?.username}</span>{" "}
        </p>
      </Separator>
      <div className="flex items-center gap-2">
        <p>Send your first message:</p>
        <Button
          disabled={!Boolean(userId)}
          onClick={() => {
            createChatWithMessage.mutate({
              conversation: {
                members: [userId!],
              },
              message: {
                body: `Hey, what's up?`,
              },
            });
            // createChat.mutate({
            //   members: [userId],
            // });
            //
            // createMessage.mutate({
            //   conversationId: conversation._id,
            //   body: `Hey, what's up?`,
            // });
          }}
        >
          Hey, what's up?
        </Button>
      </div>
    </div>
  );
};

// export const ConversationEmptyMessages = ({
//   conversation,
// }: {
//   conversation: Conversation;
// }) => {
//   const conversationCreator = useConversationCreator(conversation);
//   const creationDate = useMemo(
//     () => format(conversation.createdAt, "do 'of' MMMM yyyy"),
//     [conversation.createdAt],
//   );
//   const createMessage = useCreateMessage();
//
//   return (
//     <div className="flex flex-col items-center w-full gap-3">
//       <Separator>
//         <p className="text-sm">
//           Created by{" "}
//           <span className="text-brand-200">
//             @{conversationCreator?.username}
//           </span>{" "}
//           • {creationDate}
//         </p>
//       </Separator>
//       <div className="flex items-center gap-2">
//         <p>Send your first message:</p>
//         <Button
//           onClick={() => {
//             createMessage.mutate({
//               conversationId: conversation._id,
//               body: `Hey, what's up?`,
//             });
//           }}
//         >
//           Hey, what's up?
//         </Button>
//       </div>
//     </div>
//   );
// };
