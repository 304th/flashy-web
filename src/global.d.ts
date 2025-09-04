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

  type Paginated<T> = { pages: T[]; pageParams: number[] };
  type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
  type PostType =
    | "social"
    | "written"
    | "video"
    | "spark"
    | "comment"
    | "reply";
  type ReactionType = "like";

  interface ApiResponse {
    data: any;
    success: boolean;
    error?: string;
  }

  interface User {
    fbId: string;
    email?: string;
    username: string;
    userimage: string;
    verified?: boolean;
    moderator?: boolean;
    representative?: boolean;
    superAdmin?: boolean;
  }

  interface Author {
    fbId: string;
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
    _id: string;
    description: string;
    image: string;
    poll: any[];
    reactions: Record<string, Record<string, Reaction>>;
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

  interface Reaction {
    _id?: string;
    username: string;
    userimage: string;
    fbId: string;
    count?: number;
  }

  interface CommentReply {
    _id?: string;
    text: string;
    repliesCount: number;
    likesCount: number;
    item_key: string;
    item_type: string;
    created_by: {
      _id: string;
      username: string;
      userimage: string;
    };
    created_at: string;
    isLiked: boolean;
  }

  interface Reactable {
    _id: string;
    reactions: Record<string, Record<string, Reaction>>;
  }
}

export {};
