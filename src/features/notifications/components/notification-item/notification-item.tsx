import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Heart, Flame, MessageCircle } from "lucide-react";

interface NotificationItemProps {
  notification: UserNotification;
}

const getNotificationLink = (notification: UserNotification): string | null => {
  const { pushData } = notification;

  switch (pushData.type) {
    case "new follower":
      return pushData.follower_id
        ? `/channel/social?id=${pushData.follower_id}`
        : null;
    case "new comment post":
      return pushData.post_id ? `/social/post?id=${pushData.post_id}` : null;
    case "relit":
      return pushData.item_id ? `/social/post?id=${pushData.item_id}` : null;
    case "new master post":
      return pushData.post_id ? `/social/post?id=${pushData.post_id}` : null;
    default:
      return null;
  }
};

const getShortTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  if (secondsAgo < 60) {
    return "now";
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo}m`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo}h`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo}d`;
  }

  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return `${weeksAgo}w`;
  }

  const monthsAgo = Math.floor(daysAgo / 30);
  return `${monthsAgo}mo`;
};

const getNotificationIcon = (text: string) => {
  if (text.includes("liked")) {
    return <Heart className="w-4 h-4 fill-red-500 text-red-500" />;
  }
  if (text.includes("Relighted")) {
    return <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />;
  }
  if (text.includes("Commented")) {
    return <MessageCircle className="w-4 h-4 fill-gray-400 text-gray-400" />;
  }
  return null;
};

const formatNotificationText = (text: string, usernames: string[]) => {
  const parts: Array<{ text: string; isLink: boolean; isBold: boolean }> = [];

  let remainingText = text;

  // Extract username from the beginning if available
  if (usernames.length > 0) {
    const username = usernames[0];
    if (text.startsWith(username)) {
      parts.push({ text: username, isLink: false, isBold: true });
      parts.push({ text: " ", isLink: false, isBold: false });
      remainingText = text.substring(username.length).trim();
    }
  }

  // Match quoted strings (like "My Amazing Video", "My amazing Story")
  const quotedRegex = /"([^"]+)"/g;
  let currentIndex = 0;
  let match;

  while ((match = quotedRegex.exec(remainingText)) !== null) {
    // Add text before the quoted string
    if (match.index > currentIndex) {
      const beforeText = remainingText.substring(currentIndex, match.index);
      if (beforeText) {
        parts.push({ text: beforeText, isLink: false, isBold: false });
      }
    }

    // Add the quoted string as a link
    parts.push({ text: match[1], isLink: true, isBold: false });
    currentIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (currentIndex < remainingText.length) {
    const afterText = remainingText.substring(currentIndex);
    if (afterText) {
      parts.push({ text: afterText, isLink: false, isBold: false });
    }
  }

  // If no parts were created (no username found), just return the whole text
  if (parts.length === 0) {
    return <span className="text-gray-300">{text}</span>;
  }

  return (
    <>
      {parts.map((part, index) => {
        if (part.isBold) {
          return (
            <span key={index} className="font-semibold text-white">
              {part.text}
            </span>
          );
        }
        if (part.isLink) {
          return (
            <span key={index} className="text-blue-400 underline">
              {part.text}
            </span>
          );
        }
        return (
          <span key={index} className="text-gray-300">
            {part.text}
          </span>
        );
      })}
    </>
  );
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const icon = getNotificationIcon(notification.text);
  const relativeTime = getShortTimeAgo(notification.time);
  const link = getNotificationLink(notification);

  const content = (
    <div className="flex items-center gap-3 px-4 py-3 bg-base-200 hover:bg-base-300 transition-colors border-b border-base-400">
      <UserAvatar
        avatar={notification.userImage}
        className="h-12 w-12 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-base leading-tight">
          {formatNotificationText(notification.text, notification.usernames)}
        </p>
      </div>

      {icon && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}

      {notification.image && (
        <img
          src={notification.image}
          alt="Notification thumbnail"
          className="w-14 h-14 rounded object-cover flex-shrink-0"
        />
      )}

      <span className="text-gray-400 text-sm flex-shrink-0 ml-2">
        {relativeTime}
      </span>
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
};
