declare global {
  interface Token {
    accessToken: string;
    refreshToken: string
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
}

export {};
