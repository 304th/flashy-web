// Utility functions for conversations
export const extractChatIdFromMembers = (members: Author[]) =>
  [...members.map((member: Author) => member.fbId)].sort().join(":");
