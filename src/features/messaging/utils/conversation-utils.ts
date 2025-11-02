import { format, isToday, isYesterday, differenceInSeconds } from "date-fns";

export const extractChatIdFromMembers = (members: (Author | string)[]) =>
  [
    ...members.map((member: Author | string) =>
      typeof member === "string" ? member : member.fbId,
    ),
  ]
    .sort()
    .join(":");

export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatDateLabel = (date: Date): string => {
  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  const day = date.getDate();
  const month = format(date, "MMMM");
  const year = format(date, "yyyy");

  return `${day}${getOrdinalSuffix(day)} of ${month} ${year}`;
};

/**
 * Checks if two messages have the same timestamp display.
 * Messages are considered to have the same timestamp if:
 * - Both are "Now" (within 60 seconds), or
 * - Both have the same minute (format "h:mm a")
 */
export const hasSameTimestamp = (
  message1: Message,
  message2: Message,
): boolean => {
  const date1 = new Date(message1.createdAt);
  const date2 = new Date(message2.createdAt);

  const secondsSinceCreated1 = differenceInSeconds(new Date(), date1);
  const secondsSinceCreated2 = differenceInSeconds(new Date(), date2);

  const isNow1 = secondsSinceCreated1 < 60;
  const isNow2 = secondsSinceCreated2 < 60;

  // Both are "Now"
  if (isNow1 && isNow2) {
    return true;
  }

  // One is "Now" and the other is not - different timestamps
  if (isNow1 !== isNow2) {
    return false;
  }

  // Both are not "Now" - check if they have the same minute
  const time1 = format(date1, "h:mm a");
  const time2 = format(date2, "h:mm a");

  return time1 === time2;
};
