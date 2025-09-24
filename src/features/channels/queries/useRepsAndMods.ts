import { getQuery } from "@/lib/query-toolkit";
import { api } from "@/services/api";

export type RepsAndMods = Pick<User, 'fbId' | 'moderator' | 'verified' | 'representative'>

export const useRepsAndMods = () => getQuery<Record<string, RepsAndMods>>(['channels', 'repsAndMods'], async () => {
  const data = await api.get('users/moderatorsAndVerifiedAndMasters').json<{ moderatorsAndVerified: RepsAndMods[] }>()

  return data.moderatorsAndVerified.reduce((acc, user) => {
    acc[user.fbId] = user;

    return acc;
  }, {} as Record<string, RepsAndMods>);
})
