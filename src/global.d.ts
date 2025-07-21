declare global {
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
    avatar: string;
    verified?: boolean;
    moderator?: boolean;
    representative?: boolean;
    superAdmin?: boolean;
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
