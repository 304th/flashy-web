import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export interface SubmissionCreator {
  fbId: string;
  username: string;
  userimage: string;
  email?: string;
  followersCount?: number;
}

export interface SubmissionWithDetails extends CreatorOpportunity {
  creator?: SubmissionCreator | null;
  opportunity?: Opportunity | null;
}

export const useSubmissionById = (submissionId: string | undefined) => {
  return useQuery({
    queryKey: ["business", "submission", submissionId],
    queryFn: async () => {
      return api
        .get(`sponsor/submissions/${submissionId}`)
        .json<SubmissionWithDetails>();
    },
    enabled: Boolean(submissionId),
  });
};
