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
    createdAt: string;
    updatedAt: string;
  }
}

export {};
