const toKebab = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

const BASIC_NAMES = [
  "First Upload Flex",
  "Short Stack Starter",
  "Streamer Switch-On",
  "Thought Leader",
  "Profile Polish",
  "Community Spark",
  "Engagement Engine",
  "Monetisation Ready",
  "Clip It Clean",
  "Consistency Kickoff",
];

const ADVANCED_NAMES = [
  "Content Creator Path",
  "Short-Form Specialist",
  "Streaming Streak",
  "Audience Builder",
  "Engagement Magnet",
  "Social Signal",
  "Community Connector",
  "Consistency Creator",
  "Monetisation Master",
  "Platform Pioneer",
];

const basicSet = new Set(BASIC_NAMES.map(toKebab));
const advancedSet = new Set(ADVANCED_NAMES.map(toKebab));

export function getChallengeIcon(name: string): string | null {
  const kebab = toKebab(name);

  if (basicSet.has(kebab)) {
    return `/images/challenges/basic/${kebab}.png`;
  }

  if (advancedSet.has(kebab)) {
    return `/images/challenges/advanced/${kebab}.png`;
  }

  return null;
}
