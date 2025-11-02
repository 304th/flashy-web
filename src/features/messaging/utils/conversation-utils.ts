export const extractChatIdFromMembers = (members: (Author | string)[]) =>
  [...members.map((member: Author | string) => typeof member === 'string' ? member : member.fbId)].sort().join(":");
