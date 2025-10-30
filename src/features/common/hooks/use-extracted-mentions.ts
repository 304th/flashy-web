import { useEffect } from "react";

const extractMentions = (text: string): string[] => {
  const mentionRegex = /@([a-zA-Z0-9_]{1,20})/g;
  const matches = text.match(mentionRegex);

  return matches ? Array.from(new Set(matches.map((m) => m.slice(1)))) : [];
};

export const useExtractedMentions = (
  text: string,
  onChange: (mentions: string[]) => void,
) => {
  useEffect(() => {
    const usernames = extractMentions(text);

    onChange(usernames);
  }, [text]);
};
