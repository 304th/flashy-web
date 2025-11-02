import { useMemo } from "react";
import { format } from "date-fns";
import { useIsChatMessageOwned } from "@/features/messaging/hooks/use-is-chat-message-owned";

const BRIGHT_COLORS = [
  { bg: "bg-blue-900", border: "border-blue-500" },
  { bg: "bg-green-900", border: "border-green-500" },
  { bg: "bg-purple-900", border: "border-purple-500" },
  { bg: "bg-pink-900", border: "border-pink-500" },
  { bg: "bg-cyan-900", border: "border-cyan-500" },
  { bg: "bg-indigo-900", border: "border-indigo-500" },
  { bg: "bg-rose-900", border: "border-rose-500" },
  { bg: "bg-violet-900", border: "border-violet-500" },
  { bg: "bg-emerald-900", border: "border-emerald-500" },
  { bg: "bg-sky-900", border: "border-sky-500" },
  { bg: "bg-teal-900", border: "border-teal-500" },
  { bg: "bg-amber-900", border: "border-amber-500" },
] as const;

// Simple hash function to convert string to number
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash);
};

export const ChatMessage = ({ message }: { message: Message }) => {
  const isOwned = useIsChatMessageOwned(message);
  const messageTime = useMemo(
    () => format(message.createdAt, "h:mm a"),
    [message.createdAt],
  );

  const nonOwnedColors = useMemo(() => {
    if (isOwned) {
      return null;
    }
    
    const combinedString = `${message.conversationId}-${message.author.fbId}`;
    const hash = hashString(combinedString);
    const colorIndex = hash % BRIGHT_COLORS.length;
    
    return BRIGHT_COLORS[colorIndex];
  }, [isOwned, message._id, message.author.fbId]);

  return (
    <div className={`flex w-full ${isOwned ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col max-w-2/3 gap-1
          ${isOwned ? "items-end" : "items-start"}`}
      >
        <div
          className={`flex w-full p-2 border-2 rounded-2xl text-white
            ${isOwned 
              ? "bg-orange-900 border-orange-500" 
              : `${nonOwnedColors?.bg} ${nonOwnedColors?.border}`
            }`}
        >
          {message.body}
        </div>
        <p className="text-sm">{messageTime}</p>
      </div>
    </div>
  );
};
