export interface StreakBadges {
  bronze: boolean;
  silver: boolean;
  gold: boolean;
}

export interface GamificationStatus {
  userId: string;
  totalXp: number;
  currentLevel: number;
  currentRank: string;
  dailyStreak: number;
  streakMultiplier: number;
  xpToNextLevel: number;
  levelProgress: number;
  streakBadges: StreakBadges;
  lastActivityDate?: string;
  lastDailyChallengeCompletedDate?: string;
  dailyChallenges: {
    uploadToday: boolean;
    commentToday: boolean;
    reactToday: boolean;
    thoughtToday: boolean;
    watchMinutesToday: number;
    reactionsToday: number;
    shortsUploadedToday: number;
    lastReset: string;
  };
  challengeProgress: {
    videosUploaded: number;
    shortsUploaded: number;
    streamingMinutes: number;
    thoughtsPosted: number;
    commentsPosted: number;
    likesReceived: number;
    followersCount: number;
    uploadDays: number;
    activeDays: number;
    consecutiveActiveDays: number;
    monetisationApplied: number;
    monetisationApproved: number;
    campaignsCompleted: number;
    profileCompleted: boolean;
    completedChallengesCount: number;
    referralsCompleted: number;
    uniqueCreatorsCommented: number;
  };
}

export interface Challenge {
  _id: string;
  key: string;
  name: string;
  description: string;
  type: "basic" | "advanced" | "daily";
  category: string;
  tier?: number;
  requirement: {
    field: string;
    threshold: number;
    condition: string;
  };
  xpReward: number;
  badgeId?: string;
  resetDaily?: boolean;
  isActive?: boolean;
  // Added by API based on user progress
  currentValue?: number;
  targetValue?: number;
  progress?: number;
  isCompleted?: boolean;
  isClaimed?: boolean;
  canClaim?: boolean;
}

export interface ChallengesResponse {
  challenges: Challenge[];
  completedCount: number;
  totalCount: number;
  totalXpAvailable: number;
  totalXpEarned: number;
}

export interface DailyChallengesResponse {
  challenges: Challenge[];
  completedCount: number;
  totalCount: number;
  totalXpAvailable: number;
  totalXpEarned: number;
  lastReset: string;
}

export interface XpTransaction {
  _id: string;
  userId: string;
  amount: number;
  baseAmount: number;
  streakMultiplier: number;
  eventType: string;
  sourceId?: string;
  levelBefore: number;
  levelAfter: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  userimage: string;
  totalXp: number;
  currentLevel: number;
  currentRank: string;
}

export interface LevelInfo {
  level: number;
  xpRequired: number;
  rank: string;
}

export interface StreakData {
  dailyXp: number[];
  milestones: {
    bronze: { day: number; xpBonus: number; name: string };
    silver: { day: number; xpBonus: number; name: string };
    gold: { day: number; xpBonus: number; name: string };
  };
  totalXpFor30Days: number;
}
