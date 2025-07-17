declare global {
  interface Token {
    accessToken: string;
    refreshToken: string;
  }

  interface Me {
    id: string;
    name: string;
    avatar: string;
  }

  interface LegacyMe {
    fbId: string;
    username: string;
    superAdmin: string;
    userimage: string;
    token: Token;
  }

  interface LegacyAuthor {
    fbId: string;
    username: string;
    userimage: string;
  }

  interface User {
    id: string;
    name: string;
    avatar: string;
    verified?: boolean;
    moderator?: boolean;
  }

  interface Stream {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    externalStreamId: string;
    userId: string;
    author: User;
    createdAt: string;
    updatedAt: string;
  }

  type JwtToken = `ey${string}.${string}.${string}`;
}

export {};
