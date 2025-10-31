export const useConversationCreator = (conversation: Conversation) =>
  conversation.members.find((user) => user.fbId === conversation.hostID);
