declare global {
  type JwtToken = `ey${string}.${string}.${string}`;

  interface SuccessResponse<T> {
    success: true;
    data: T;
  }

  interface ErrorResponse {
    success: false;
    error: string;
  }

  type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

  interface ApiResponse {
    data: any;
    success: boolean;
    error?: string;
  }

  interface User {
    id: string;
    email?: string;
    username: string;
    userimage: string;
    verified?: boolean;
    moderator?: boolean;
    representative?: boolean;
    superAdmin?: boolean;
  }

  interface Author {
    id: string;
    username: string;
    userimage: string;
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

  interface SocialPost {
    id: string;
    description: string;
    image: string;
    poll: any[];
    likesCount: number;
    commentsCount: number;
    relitsCount: number;
    mentionedUsers: any[];
    pinned: boolean;
    userId: string;
    username: string;
    userimage: string;
    createdAt: string;
    updatedAt: string;
  }
}

export {};
