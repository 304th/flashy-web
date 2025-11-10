import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useQuery } from "@tanstack/react-query";

export const useFingerprint = () => {
  const query = useQuery({
    queryKey: ["auth", "fingerprint"],
    queryFn: async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      return result.visitorId;
    },
  });

  return [query.data, query] as const;
};
