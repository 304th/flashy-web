declare global {
  type JwtToken = `ey${string}.${string}.${string}`;

  interface StaticSchema<T> {
    getId(): keyof T;
    createEntityFromParams(params?: Partial<T>): T;
  }

  interface SuccessResponse<T> {
    success: true;
    data: T;
  }

  interface ErrorResponse {
    success: false;
    error: string;
  }

  type Paginated<T> = { pages: T[]; pageParams: number[] };
  type PaginatedList<T> = { pages: T; pageParams: number[] };
  type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
  type PostType =
    | "social"
    | "written"
    | "video"
    | "spark"
    | "comment"
    | "reply";
  type ReactionType = "like";
  type Optimistic<T> = {
    _optimisticStatus?: "success" | "pending" | "error";
    _optimisticId?: string;
  } & T;

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
    mutedUsers?: string[];
    bio?: string;
    banner?: string;
    links?: Record<string, string>;
    followersCount?: number;
    followingCount?: number;
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

  interface PollOption {
    id: number;
    text: string;
    votes: number;
  }

  interface ResponsibleUser {
    userId: string;
    username: string;
  }

  interface SocialPost {
    _id: string;
    description: string;
    images: string[];
    poll: { pollVotedId: number | null; results: PollOption[] };
    reactions: Record<string, Record<string, Reaction>>;
    likesCount: number;
    commentsCount: number;
    relitsCount: number;
    relits?: Record<string, unknown>;
    relightedBy?: ResponsibleUser;
    relightedPost?: SocialPost;
    mentionedUsers: any[];
    pinned: boolean;
    pinnedBy?: ResponsibleUser;
    orderId: string;
    userId: string;
    username: string;
    userimage: string;
    behindKey?: boolean;
    unlocked?: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface VideoPost {
    _id: string;
    fbId: string;
    title: string;
    description?: string;
    publishDate: number;
    storyImage: string;
    videoId: string;
    hostID: string;
    videoDuration: number;
    views: number;
    price: number;
    username: string;
    userimage?: string;
    createdAt: number;
  }

  interface Reaction {
    _id?: string;
    username: string;
    userimage: string;
    fbId: string;
    count?: number;
  }

  interface CommentPost {
    _id: string;
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
    mentionedUsers: any[];
    created_at: string;
    isLiked: boolean;
  }

  interface Reply {
    _id: string;
    text: string;
    likesCount: number;
    item_key: string;
    item_type: string;
    created_by: {
      _id: string;
      username: string;
      userimage: string;
    };
    mentionedUsers: any[];
    created_at: string;
    isLiked: boolean;
  }

  interface Commentable {
    _id: string;
  }

  interface Reactable {
    _id: string;
    reactions: Record<string, Record<string, Reaction>>;
  }

  interface Likeable {
    _id: string;
    likesCount: number;
    isLiked: boolean;
  }

  interface Shareable {
    _id: string;
  }

  interface Relightable {
    _id: string;
    relitsCount: number;
    relits?: Record<string, unknown>;
  }

  interface LinkPreview {
    contentType: string;
    description: string;
    favicons: string[];
    images: string[];
    mediaType: "website" | "article";
    siteName: string;
    title: string;
    url: string;
    videos: string[];
  }

  interface WalletBalance {
    blaze: string;
    usdc: string;
    usdt: string;
  }

  interface Key {
    user: string;
    boughtBy: string;
    boughtPrice: string;
  }

  interface KeyPrice {
    buy: number;
    buyInBlaze: number;
    sell: number;
    sellInBlaze: number;
  }

  type WalletToken = "blaze" | "usdt" | "usdc";

  interface KeyDetails {
    _id: string;
    user: User | null;
    boughtBy: string;
    holders: number;
    buyPrice: number;
    boughtPrice: string;
    sellPrice: number;
    lastPrice: number | null;
  }

  interface VideoUploadOptions {
    token: {
      token: string;
      ttl: number;
      expiresAt: string | null;
    };
    video: {
      videoId: string;
    };
  }

  // Augment in your app to get typed channel names in query-toolkit-v2
  // Example:
  // declare global { interface QueryToolkitChannels { posts: true; profile: true } }
  interface QueryToolkitChannels {}
}

export {};
