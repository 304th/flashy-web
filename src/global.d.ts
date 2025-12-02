declare global {
  type TODO = any;
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
    _optimisticError?: string;
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
    receivesMessagesFromAnyone?: boolean;
  }

  interface Author {
    fbId: string;
    username: string;
    userimage: string;
  }

  type StreamStatus = "upcoming" | "scheduled" | "live" | "ended" | "cancelled";

  interface Stream {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    externalStreamId: string;
    userId: string;
    author: User;
    status: StreamStatus;
    scheduledAt?: string;
    startedAt?: string;
    endedAt?: string;
    isLive: boolean;
    viewerCount: number;
    chatEnabled: boolean;
    streamKey?: string;
    rtmpUrl?: string;
    recordingUrl?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface ChatMessage {
    _id: string;
    streamId: string;
    user: Author;
    message: string;
    createdAt: string;
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
    category?: string;
    statusweb: "draft" | "published";
    reactions: Record<string, Record<string, Reaction>>;
    playlist?: Playlist;
    series?: string;
    playbackAssets: {
      player: string;
      hls: string;
      mp4: string;
    };
    createdAt: number;
  }

  interface Playlist {
    _id: string;
    fbId: string;
    title: string;
    description?: string;
    publishedDate: string;
    image: string;
    hostID: string;
    username: string;
    userimage?: string;
    order?: string[];
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

  interface Message {
    _id: string;
    conversationId: string;
    author: Author;
    body: string;
    attachmentURL: string;
    tipAmount: number;
    mentionedUsers: any[];
    deletedBy: string[];
    createdAt: string;
    replyToMessage: string;
  }

  interface Conversation {
    _id: string;
    type: "chat" | "groupChat" | "channel";
    channelMode: string;
    thumbnail: string;
    hostID: string;
    members: (Pick<User, "fbId" | "username" | "userimage"> & {
      online?: boolean;
    })[];
    lastMessage: Message | null;
    mutedBy: string[];
    hideFor: string[];
    readBy: string[];
    title?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Commentable {
    _id: string;
  }

  // interface Reactable {
  //   _id: string;
  //   reactions: Record<string, Record<string, Reaction>>;
  // }

  type Reactable = SocialPost | VideoPost;

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

  interface UserNotification {
    _id: string;
    actionUserId: string;
    generalAlertId: string;
    image: string | null;
    orderId: number;
    pushData: {
      follower_id?: string;
      type: string;
      post_id?: string;
      item_id?: string;
    };
    text: string;
    time: number;
    userId: string;
    userImage: string;
    usernames: string[];
  }

  // Augment in your app to get typed channel names in query-toolkit-v2
  // Example:
  // declare global { interface QueryToolkitChannels { posts: true; profile: true } }
  interface QueryToolkitChannels {}

  // ==================== MONETISE TYPES ====================

  type OpportunityType = "sponsorship" | "partnership" | "affiliate";
  type OpportunityCategory =
    | "lifestyle"
    | "health & well-being"
    | "technology"
    | "fashion & beauty"
    | "food & beverage"
    | "travel"
    | "finance"
    | "education"
    | "entertainment"
    | "sports & fitness"
    | "gaming"
    | "business";
  type OpportunityStatus = "active" | "expired" | "paused";
  type CompensationType =
    | "fixed"
    | "per-post"
    | "commission"
    | "product"
    | "negotiable";
  type CreatorOpportunityStatus =
    | "accepted"
    | "pending-deliverables"
    | "submitted"
    | "under-review"
    | "approved"
    | "rejected"
    | "expired"
    | "completed";

  interface OpportunityEligibility {
    minFollowers: number;
    niches: string[];
    platforms: string[];
    countries: string[];
  }

  interface Opportunity {
    _id: string;
    title: string;
    brandName: string;
    brandLogo?: string;
    mediaAssets?: string[];
    type: OpportunityType;
    category: OpportunityCategory;
    description: string;
    deliverables: string[];
    compensation: string;
    compensationType: CompensationType;
    eligibility: OpportunityEligibility;
    deadline: string;
    requiresApplication: boolean;
    termsAndConditions: string;
    status: OpportunityStatus;
    createdBy: string;
    sponsorId?: string;
    maxParticipants: number;
    currentParticipants: number;
    createdAt: string;
    updatedAt: string;
  }

  interface SubmissionFile {
    url: string;
    filename: string;
    type?: string;
    size?: number;
    uploadedAt?: string;
  }

  interface Submission {
    files: SubmissionFile[];
    links: string[];
    note?: string;
  }

  interface CreatorOpportunity {
    _id: string;
    creatorId: string;
    opportunityId: string | Opportunity;
    status: CreatorOpportunityStatus;
    appliedAt: string;
    acceptedAt?: string;
    submittedAt?: string;
    approvedAt?: string;
    completedAt?: string;
    submission?: Submission;
    feedback?: string;
    resubmitCount: number;
    tcAgreedAt?: string;
    tcVersion?: string;
    reminder5DaySent?: boolean;
    reminder1DaySent?: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface OpportunityListParams {
    page?: number;
    limit?: number;
    type?: OpportunityType;
    category?: OpportunityCategory;
    niche?: string | string[];
    minPayout?: number;
    search?: string;
    status?: OpportunityStatus;
    sortBy?: "createdAt" | "deadline" | "compensation";
    sortOrder?: "asc" | "desc";
  }

  interface OpportunityListResponse {
    opportunities: Opportunity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }

  interface CreatorOpportunityListResponse {
    creatorOpportunities: CreatorOpportunity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }

  interface SponsorSubmissionsResponse {
    submissions: CreatorOpportunity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }

  interface PresignedUrlRequest {
    filename: string;
    contentType: string;
  }

  interface PresignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
    key: string;
    filename: string;
    originalFilename: string;
    expiresIn: number;
    contentType: string;
  }

  interface AcceptOpportunityResponse {
    success: boolean;
    creatorOpportunity: CreatorOpportunity;
    message: string;
  }

  interface SubmitDeliverablesResponse {
    success: boolean;
    creatorOpportunity: CreatorOpportunity;
    message: string;
    resubmitsRemaining?: number;
  }

  interface ApproveRejectResponse {
    success: boolean;
    creatorOpportunity: CreatorOpportunity;
    message: string;
  }

  interface CreateOpportunityParams {
    title: string;
    brandName: string;
    brandLogo?: string;
    mediaAssets?: string[];
    type: OpportunityType;
    category: OpportunityCategory;
    description: string;
    deliverables: string[];
    compensation: string;
    compensationType?: CompensationType;
    eligibility?: Partial<OpportunityEligibility>;
    deadline: string;
    requiresApplication?: boolean;
    termsAndConditions: string;
    status?: OpportunityStatus;
    sponsorId?: string;
    maxParticipants?: number;
  }

  interface UpdateOpportunityParams extends Partial<CreateOpportunityParams> {}

  // ==================== BUSINESS ACCOUNT TYPES ====================

  type BusinessAccountStatus = "pending" | "approved" | "rejected";
  type BusinessAccountCategory =
    | "lifestyle"
    | "health & well-being"
    | "technology"
    | "fashion & beauty"
    | "food & beverage"
    | "travel"
    | "finance"
    | "education"
    | "entertainment"
    | "sports & fitness"
    | "gaming"
    | "business";

  interface BusinessAccount {
    _id: string;
    userId: string;
    title: string;
    description: string;
    category: BusinessAccountCategory;
    status: BusinessAccountStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    approvedBy?: string;
    rejectedAt?: string;
    rejectedBy?: string;
  }

  interface BusinessAccountWithUser extends BusinessAccount {
    user?: {
      fbId: string;
      username: string;
      email?: string;
      userimage: string;
    };
  }

  interface CreateBusinessAccountParams {
    title: string;
    description: string;
    category: BusinessAccountCategory;
  }

  interface UpdateBusinessAccountParams {
    title?: string;
    description?: string;
    category?: BusinessAccountCategory;
  }

  interface BusinessAccountListParams {
    page?: number;
    limit?: number;
    status?: BusinessAccountStatus;
    category?: BusinessAccountCategory;
    userId?: string;
    sortBy?: "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
  }

  interface BusinessAccountListResponse {
    businessAccounts: BusinessAccount[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }

  interface BusinessAccountStatsResponse {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  }

  interface BusinessAccountActionResponse {
    success: boolean;
    businessAccount?: BusinessAccount;
    message: string;
  }
}

export {};
