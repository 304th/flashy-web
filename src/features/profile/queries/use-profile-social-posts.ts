import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { profileSocialFeedCollection } from "@/features/profile/entities/profile-social-feed.collection";

export const useProfileSocialPosts = () => {
  const authed = useAuthed(); //FIXME: replace with useMe

  return usePartitionedQuery<SocialPost, { pageParam: number }>({
    queryKey: ["me", authed.user?.uid, "social"],
    collection: profileSocialFeedCollection,
    getParams: ({ pageParam }) => ({ pageParam }),
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
