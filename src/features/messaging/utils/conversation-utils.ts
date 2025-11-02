import {format, isToday, isYesterday} from "date-fns";

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