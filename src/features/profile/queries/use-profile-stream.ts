import {useLiveEntity} from "@/lib/query-toolkit-v2";
import {profileStreamEntity} from "@/features/profile/entities/profile-stream.entity";
import {useAuthed} from "@/features/auth/hooks/use-authed";

export const useProfileStream = () => {
  const authed = useAuthed()

  return useLiveEntity<Stream>({
    entity: profileStreamEntity,
    queryKey: ["me", "stream"],
    options: {
      enabled: Boolean(authed.user?.uid),
    }
  })
}