import { useMemo } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileUnreadConversations } from "@/features/profile/queries/use-profile-unread-conversations";

export const MessagesButton = () => {
  const { data: unreadConversations } = useProfileUnreadConversations();
  const unreadCount = useMemo(
    () => unreadConversations?.length ?? 0,
    [unreadConversations],
  );

  return (
    <Link href="/messages" className="relative flex">
      <Button
        className="!w-fit p-0 aspect-square"
        size="sm"
        variant="secondary"
      >
        <MessageCircle />
      </Button>
      {unreadCount > 0 && (
        <div
          className="absolute top-[-15%] right-[-15%] flex items-center
            justify-center h-4 w-4 bg-orange-500 text-white p-1 rounded-lg"
        >
          <p className="font-medium text-sm">{unreadCount}</p>
        </div>
      )}
    </Link>
  );
};
